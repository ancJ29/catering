import { PRStatus } from "@/auto-generated/api-configs";
import {
  AddPurchaseCoordinationRequest,
  AddPurchaseInternalRequest,
  Inventory,
  Material,
  PurchaseRequest,
  PurchaseRequestDetail,
  addPurchaseCoordination,
  addPurchaseInternal,
  getMaterialInventories,
  getPurchaseRequestById,
  updatePurchaseRequest,
} from "@/services/domain";
import useMaterialStore from "@/stores/material.store";
import { cloneDeep, createStore } from "@/utils";
import { getConvertedAmount } from "@/utils/unit";

const NCC = "NCC";

type State = {
  purchaseRequest?: PurchaseRequest;
  currents: Record<string, CoordinationDetail>;
  updates: Record<string, CoordinationDetail>;
  materialIds: string[];
  selectedMaterialIds: string[];
  deletedPurchaseDetailIds: string[];
  isAllPurchaseInternal: boolean | null;
  inventories: Record<string, Inventory>;
  generalCatering: string | null;
};

export enum ActionType {
  RESET = "RESET",
  INIT_DATA = "INIT_DATA",
  REMOVE_MATERIAL = "REMOVE_MATERIAL",
  SET_IS_SELECTED = "SET_IS_SELECTED",
  SET_AMOUNT = "SET_AMOUNT",
  SET_SUPPLIER_NOTE = "SET_SUPPLIER_NOTE",
  SET_INTERNAL_NOTE = "SET_INTERNAL_NOTE",
  SET_DELIVERY_CATERING = "SET_DELIVERY_CATERING",
  SET_GENERAL_CATERING = "SET_GENERAL_CATERING",
  SET_IS_ALL_PURCHASE_INTERNAL = "SET_IS_ALL_PURCHASE_INTERNAL",
}

type Action = {
  type: ActionType;
  purchaseRequest?: PurchaseRequest;
  materialId?: string;
  amount?: number;
  note?: string;
  isSelected?: boolean;
  isAllPurchaseInternal?: boolean;
  cateringId?: string | null;
  inventories?: Inventory[];
};

const defaultState = {
  currents: {},
  updates: {},
  materialIds: [],
  selectedMaterialIds: [],
  deletedPurchaseDetailIds: [],
  isAllPurchaseInternal: false,
  inventories: {},
  generalCatering: null,
};

const { dispatch, ...store } = createStore<State, Action>(reducer, {
  ...defaultState,
});

export default {
  ...store,
  async initData(purchaseRequestId: string) {
    const purchaseRequest = await getPurchaseRequestById(
      purchaseRequestId,
    );
    if (!purchaseRequest?.purchaseRequestDetails) {
      return;
    }
    const inventories = await getMaterialInventories(
      purchaseRequest.purchaseRequestDetails.map((e) => e.materialId),
    );
    dispatch({
      type: ActionType.INIT_DATA,
      purchaseRequest,
      inventories,
    });
  },
  getPurchaseRequest() {
    return store.getSnapshot().purchaseRequest;
  },
  removeMaterial(materialId: string) {
    dispatch({
      type: ActionType.REMOVE_MATERIAL,
      materialId,
    });
  },
  setAmount(materialId: string, amount: number) {
    dispatch({
      type: ActionType.SET_AMOUNT,
      materialId,
      amount,
    });
  },
  setSupplierNote(materialId: string, note: string) {
    dispatch({
      type: ActionType.SET_SUPPLIER_NOTE,
      materialId,
      note,
    });
  },
  setInternalNote(materialId: string, note: string) {
    dispatch({
      type: ActionType.SET_INTERNAL_NOTE,
      materialId,
      note,
    });
  },
  setIsSelected(materialId: string, isSelected: boolean) {
    dispatch({
      type: ActionType.SET_IS_SELECTED,
      materialId,
      isSelected,
    });
  },
  isSelected(materialId: string) {
    return store
      .getSnapshot()
      .selectedMaterialIds.includes(materialId);
  },
  setIsAllPurchaseInternal(
    isAllPurchaseInternal: boolean,
    // cateringId: string | null,
  ) {
    dispatch({
      type: ActionType.SET_IS_ALL_PURCHASE_INTERNAL,
      isAllPurchaseInternal,
      // cateringId: cateringId === null ? NCC : cateringId,
    });
  },
  setDeliveryCatering(materialId: string, cateringId: string | null) {
    dispatch({
      type: ActionType.SET_DELIVERY_CATERING,
      materialId,
      cateringId,
    });
  },
  setGeneralCatering(cateringId: string | null) {
    dispatch({
      type: ActionType.SET_GENERAL_CATERING,
      cateringId,
    });
  },
  getPrice(materialId: string) {
    return store.getSnapshot().currents[materialId]?.price || 0;
  },
  getInventory(materialId: string) {
    const state = store.getSnapshot();
    const { materials } = useMaterialStore.getState();
    const deliveryCatering =
      state.currents[materialId].deliveryCatering;
    const inventory =
      state.inventories[`${deliveryCatering}-${materialId}`];
    return getConvertedAmount({
      material: materials.get(materialId),
      amount: inventory?.amount || 0,
      reverse: true,
    });
  },
  async update(status: PRStatus, priority: string) {
    const state = store.getSnapshot();
    if (!status || !state.purchaseRequest) {
      return false;
    }
    if (status === "DDP" && state.purchaseRequest) {
      await updatePurchaseRequest(
        state.purchaseRequest,
        [],
        [],
        status,
        priority,
      );
      const grouped: { [key: string]: CoordinationDetail[] } = {};
      for (const key of Object.keys(state.updates)) {
        if (key === null) {
          return false;
        }
        const detail = state.updates[key];
        const deliveryCatering = detail.deliveryCatering;
        if (!grouped[deliveryCatering]) {
          grouped[deliveryCatering] = [];
        }
        grouped[deliveryCatering].push(detail);
      }
      const purchaseInternal: AddPurchaseInternalRequest = [];
      const purchaseCoordination: AddPurchaseCoordinationRequest = [];
      Object.keys(grouped).map((key) => {
        const coordinationDetails = grouped[key];
        if (key === NCC) {
          purchaseCoordination.push({
            deliveryDate:
              state.purchaseRequest?.deliveryDate || new Date(),
            purchaseRequestId: state.purchaseRequest?.id || "",
            receivingCateringId:
              state.purchaseRequest?.departmentId || "",
            prCode: state.purchaseRequest?.code || "",
            type: state.purchaseRequest?.others.type || "",
            priority: state.purchaseRequest?.others.priority || "",
            createdById: state.purchaseRequest?.createdById || "",
            createAt: state.purchaseRequest?.createdAt || new Date(),
            approvedById: state.purchaseRequest?.approvedById || "",
            approvedAt:
              state.purchaseRequest?.approvedAt || new Date(),
            purchaseCoordinationDetails: coordinationDetails.map(
              (cd) => ({
                price: cd.price,
                amount: cd.dispatchQuantity,
                materialId: cd.materialId,
                supplierNote: cd.supplierNote,
                internalNote: cd.internalNote,
              }),
            ),
          });
        } else {
          purchaseInternal.push({
            deliveryDate:
              state.purchaseRequest?.deliveryDate || new Date(),
            receivingCateringId:
              state.purchaseRequest?.departmentId || "",
            deliveryCateringId: key,
            purchaseRequestId: state.purchaseRequest?.id || "",
            prCode: state.purchaseRequest?.code || "",
            purchaseInternalDetails: coordinationDetails.map(
              (cd) => ({
                amount: cd.dispatchQuantity,
                materialId: cd.materialId,
                supplierNote: cd.supplierNote,
                internalNote: cd.internalNote,
              }),
            ),
          });
        }
      });
      await addPurchaseInternal(purchaseInternal);
      await addPurchaseCoordination(purchaseCoordination);
      return true;
    }
    return false;
  },
};

function reducer(action: Action, state: State): State {
  const { materials } = useMaterialStore.getState();
  switch (action.type) {
    case ActionType.RESET:
      return {
        ...defaultState,
      };
    case ActionType.INIT_DATA:
      if (
        action.purchaseRequest &&
        action.inventories !== undefined
      ) {
        const currents = initPurchaseDetails(
          action.purchaseRequest,
          materials,
        );
        const materialIds = sortMaterialIds(currents);
        const inventories = Object.fromEntries(
          action.inventories.map((e) => [
            `${e.departmentId}-${e.materialId}`,
            e,
          ]),
        );
        return {
          ...state,
          purchaseRequest: action.purchaseRequest,
          currents,
          updates: cloneDeep(currents),
          materialIds,
          selectedMaterialIds: materialIds,
          inventories,
        };
      }
      break;
    case ActionType.REMOVE_MATERIAL:
      if (action.materialId && action.materialId in state.currents) {
        state.deletedPurchaseDetailIds = [
          ...state.deletedPurchaseDetailIds,
          state.currents[action.materialId].id || "",
        ];
        delete state.currents[action.materialId];
        delete state.updates[action.materialId];
        return {
          ...state,
          updates: { ...state.updates },
          materialIds: state.materialIds.filter(
            (id) => id !== action.materialId,
          ),
          selectedMaterialIds: state.materialIds.filter(
            (id) => id !== action.materialId,
          ),
          deletedPurchaseDetailIds: state.deletedPurchaseDetailIds,
        };
      }
      break;
    case ActionType.SET_IS_SELECTED:
      if (action.materialId && action.isSelected !== undefined) {
        const selectedMaterialIds = action.isSelected
          ? [...state.selectedMaterialIds, action.materialId]
          : state.selectedMaterialIds.filter(
            (id) => id !== action.materialId,
          );
        if (action.isSelected) {
          state.currents[action.materialId].deliveryCatering = NCC;
          state.updates[action.materialId].deliveryCatering = NCC;
        }
        state.isAllPurchaseInternal =
          selectedMaterialIds.length !== state.materialIds.length
            ? null
            : false;
        return {
          ...state,
          selectedMaterialIds,
        };
      }
      break;
    case ActionType.SET_AMOUNT:
      if (action.materialId && action.amount) {
        const purchaseRequest = state.currents[action.materialId];
        state.updates[action.materialId] = {
          ...purchaseRequest,
          dispatchQuantity: action.amount,
        };
      }
      break;
    case ActionType.SET_SUPPLIER_NOTE:
      if (action.materialId && action.note) {
        const purchaseRequest = state.currents[action.materialId];
        state.updates[action.materialId] = {
          ...purchaseRequest,
          supplierNote: action.note,
        };
      }
      break;
    case ActionType.SET_INTERNAL_NOTE:
      if (action.materialId && action.note) {
        const purchaseRequest = state.currents[action.materialId];
        state.updates[action.materialId] = {
          ...purchaseRequest,
          internalNote: action.note,
        };
      }
      break;
    case ActionType.SET_IS_ALL_PURCHASE_INTERNAL:
      if (action.isAllPurchaseInternal !== undefined) {
        const isAllPurchaseInternal =
          action.isAllPurchaseInternal ?? false;
        let selectedMaterialIds: string[];
        if (isAllPurchaseInternal) {
          selectedMaterialIds = [];
        } else {
          selectedMaterialIds = state.materialIds;
          state.generalCatering = null;
          for (const key of Object.keys(state.currents)) {
            state.currents[key].deliveryCatering = NCC;
            state.updates[key].deliveryCatering = NCC;
          }
        }
        return {
          ...state,
          isAllPurchaseInternal,
          selectedMaterialIds,
        };
      }
      break;
    case ActionType.SET_DELIVERY_CATERING:
      if (action.materialId && action.cateringId) {
        if (action.cateringId !== state.generalCatering) {
          state.isAllPurchaseInternal = null;
        }
        state.generalCatering = null;
        state.currents[action.materialId].deliveryCatering =
          action.cateringId;
        state.updates[action.materialId].deliveryCatering =
          action.cateringId;
        return {
          ...state,
        };
      }
      break;
    case ActionType.SET_GENERAL_CATERING:
      if (action.cateringId) {
        const isAllPurchaseInternal =
          state.isAllPurchaseInternal ?? false;
        for (const key of Object.keys(state.currents)) {
          state.currents[key].deliveryCatering = action.cateringId;
          state.updates[key].deliveryCatering = action.cateringId;
        }
        return {
          ...state,
          isAllPurchaseInternal,
          generalCatering: action.cateringId,
        };
      }
      break;
  }
  return state;
}

function initPurchaseDetails(
  purchaseRequest: PurchaseRequest,
  materials: Map<string, Material>,
) {
  return Object.fromEntries(
    purchaseRequest?.purchaseRequestDetails.map((e) => [
      e.materialId,
      initPurchaseDetail(e, materials),
    ]),
  );
}

function initPurchaseDetail(
  purchaseRequestDetail: PurchaseRequestDetail,
  materials: Map<string, Material>,
) {
  const material = materials.get(purchaseRequestDetail.materialId);
  const amount = getConvertedAmount({
    material,
    amount: purchaseRequestDetail.amount,
    reverse: true,
  });
  return {
    id: purchaseRequestDetail.id,
    materialId: purchaseRequestDetail.materialId,
    isSupply: true,
    deliveryCatering: NCC,
    orderQuantity: amount,
    dispatchQuantity: amount,
    supplierNote: purchaseRequestDetail.others.supplierNote || "",
    internalNote: purchaseRequestDetail.others.internalNote || "",
    price: purchaseRequestDetail.others.price,
  };
}

function sortMaterialIds(
  currents: Record<string, CoordinationDetail>,
) {
  const materialIds = Object.keys(currents);
  const nonZeroPriceIds = materialIds.filter(
    (materialId) => currents[materialId]?.price !== 0,
  );
  const zeroPriceIds = materialIds.filter(
    (materialId) => currents[materialId]?.price === 0,
  );
  return nonZeroPriceIds.concat(zeroPriceIds);
}

export type CoordinationDetail = {
  id: string;
  materialId: string;
  isSupply: boolean;
  deliveryCatering: string;
  orderQuantity: number;
  dispatchQuantity: number;
  supplierNote: string;
  internalNote: string;
  price: number;
};
