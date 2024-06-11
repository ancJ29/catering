import { PRStatus } from "@/auto-generated/api-configs";
import {
  Material,
  PurchaseRequest, PurchaseRequestDetail,
  getPurchaseRequestById
} from "@/services/domain";
import logger from "@/services/logger";
import useMaterialStore from "@/stores/material.store";
import { createStore } from "@/utils";
import { getConvertedAmount } from "@/utils/unit";

type State = {
  purchaseRequest?: PurchaseRequest;
  currents: Record<string, CoordinationDetail>;
  updates: Record<string, CoordinationDetail>;
  materialIds: string[];
  selectedMaterialIds: string[];
  deletedPurchaseDetailIds: string[];
};

export enum ActionType {
  RESET = "RESET",
  INIT_DATA = "INIT_DATA",
  REMOVE_MATERIAL = "REMOVE_MATERIAL",
  SET_IS_SELECTED = "SET_IS_SELECTED",
  SET_AMOUNT = "SET_AMOUNT",
  SET_SUPPLIER_NOTE = "SET_SUPPLIER_NOTE",
  SET_INTERNAL_NOTE = "SET_INTERNAL_NOTE",
}

type Action = {
  type: ActionType;
  purchaseRequest?: PurchaseRequest;
  materialId?: string;
  amount?: number;
  note?: string;
  isSelected?: boolean;
  isSelectedAll?: boolean;
};

const defaultState = {
  currents: {},
  updates: {},
  materialIds: [],
  selectedMaterialIds: [],
  deletedPurchaseDetailIds: [],
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
    if (!purchaseRequest) {
      return;
    }
    dispatch({
      type: ActionType.INIT_DATA,
      purchaseRequest,
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
  getTotalMaterial() {
    return store.getSnapshot().selectedMaterialIds.length;
  },
  getPrice(materialId: string) {
    return store.getSnapshot().currents[materialId]?.price || 0;
  },
  async update(status: PRStatus) {
    logger.info(status);
    dispatch({
      type: ActionType.RESET,
    });
  },
};

function reducer(action: Action, state: State): State {
  const { materials } = useMaterialStore.getState();
  switch (action.type) {
    case ActionType.RESET:
      return {
        ...defaultState,
      };
      break;
    case ActionType.INIT_DATA:
      if (action.purchaseRequest) {
        const currents = initPurchaseDetails(
          action.purchaseRequest,
          materials,
        );
        const materialIds = sortMaterialIds(currents);
        return {
          ...state,
          purchaseRequest: action.purchaseRequest,
          currents,
          materialIds,
          selectedMaterialIds: materialIds,
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
        return {
          ...state,
          selectedMaterialIds,
        };
      }
      break;
    case ActionType.SET_AMOUNT:
      if (action.materialId && action.amount) {
        // const purchaseRequest = state.currents[action.materialId];
        // state.updates[action.materialId] = {
        //   ...purchaseRequest,
        //   amount: action.amount,
        // };
        // return {
        //   ...state,
        // };
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
    deliveryCatering: "NCC",
    orderQuantity: amount,
    kitchenQuantity: amount,
    dispatchQuantity: amount,
    supplierNote: purchaseRequestDetail.others.supplierNote || "",
    internalNote: purchaseRequestDetail.others.internalNote || "",
    price: purchaseRequestDetail.others.price,
  };
}

function sortMaterialIds(currents: Record<string, CoordinationDetail>) {
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
  kitchenQuantity: number;
  dispatchQuantity: number;
  supplierNote: string;
  internalNote: string;
  price: number;
};
