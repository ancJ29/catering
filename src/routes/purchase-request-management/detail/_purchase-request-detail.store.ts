import { PRStatus } from "@/auto-generated/api-configs";
import {
  Inventory,
  Material,
  PurchaseRequest,
  PurchaseRequestDetail,
  getAllInventories,
  getPurchaseRequestById,
  updatePurchaseRequest,
} from "@/services/domain";
import useMaterialStore from "@/stores/material.store";
import { RequestDetail } from "@/types";
import { convertAmount, createStore, roundToDecimals } from "@/utils";

type State = {
  purchaseRequest?: PurchaseRequest;
  currents: Record<string, RequestDetail>;
  updates: Record<string, RequestDetail>;
  isSelectAll: boolean;
  materialIds: string[];
  selectedMaterialIds: string[];
  inventories: Record<string, Inventory>;
  deletedRequestDetailIds: string[];
};

enum ActionType {
  RESET = "RESET",
  INIT_DATA = "INIT_DATA",
  REMOVE_MATERIAL = "REMOVE_MATERIAL",
  SET_IS_SELECTED = "SET_IS_SELECTED",
  SET_AMOUNT = "SET_AMOUNT",
  SET_SUPPLIER_NOTE = "SET_SUPPLIER_NOTE",
  SET_INTERNAL_NOTE = "SET_INTERNAL_NOTE",
  SET_IS_SELECT_ALL = "SET_IS_SELECT_ALL",
}

type Action = {
  type: ActionType;
  purchaseRequest?: PurchaseRequest;
  inventories?: Inventory[];
  materialId?: string;
  amount?: number;
  note?: string;
  isSelected?: boolean;
  isSelectedAll?: boolean;
};

const defaultState = {
  currents: {},
  updates: {},
  isSelectAll: true,
  materialIds: [],
  selectedMaterialIds: [],
  inventories: {},
  deletedRequestDetailIds: [],
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
    const inventories = await getAllInventories(
      purchaseRequest.departmentId,
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
  setIsSelectAll(checked: boolean) {
    dispatch({
      type: ActionType.SET_IS_SELECT_ALL,
      isSelectedAll: checked,
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
  getTotalPrice() {
    const state = store.getSnapshot();
    const total = state.selectedMaterialIds.reduce(
      (sum, materialId) => {
        const price = state.currents[materialId]?.price || 0;
        const amount =
          state.updates[materialId]?.amount ||
          state.currents[materialId].amount;
        return sum + price * amount;
      },
      0,
    );
    return total;
  },
  getPrice(materialId: string) {
    return store.getSnapshot().currents[materialId]?.price || 0;
  },
  async update(status: PRStatus, priority: string) {
    const state = store.getSnapshot();
    if (!state.purchaseRequest) {
      return;
    }
    const _ids = state.materialIds.filter(
      (id) => !state.selectedMaterialIds.includes(id),
    );
    const ids_ = _ids.map((id) => state.currents[id]?.id || "");
    const ids = [...ids_, ...state.deletedRequestDetailIds];
    await updatePurchaseRequest(
      state.purchaseRequest,
      state.selectedMaterialIds
        .map((materialId) => {
          const purchaseDetail = state.updates[materialId];
          return purchaseDetail;
        })
        .filter(
          (update): update is RequestDetail => update !== undefined,
        ),
      ids,
      status,
      priority,
    );
    dispatch({
      type: ActionType.RESET,
    });
  },
  async reject(status: PRStatus, priority: string) {
    const state = store.getSnapshot();
    if (!state.purchaseRequest) {
      return;
    }
    await updatePurchaseRequest(
      state.purchaseRequest,
      [],
      [],
      status,
      priority,
    );
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
      if (action.purchaseRequest && action.inventories) {
        const inventories = new Map(
          action.inventories.map((e) => [e.materialId, e]),
        );
        const currents = initRequestDetails(
          action.purchaseRequest,
          materials,
          inventories,
        );
        const materialIds = sortMaterialIds(currents);
        return {
          ...state,
          purchaseRequest: action.purchaseRequest,
          currents,
          materialIds,
          selectedMaterialIds: materialIds,
          isSelectAll: true,
        };
      }
      break;
    case ActionType.REMOVE_MATERIAL:
      if (action.materialId && action.materialId in state.currents) {
        state.deletedRequestDetailIds = [
          ...state.deletedRequestDetailIds,
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
          deletedRequestDetailIds: state.deletedRequestDetailIds,
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
        const isSelectAll =
          selectedMaterialIds.length === state.materialIds.length;
        return {
          ...state,
          isSelectAll,
          selectedMaterialIds,
        };
      }
      break;
    case ActionType.SET_AMOUNT:
      if (action.materialId && action.amount) {
        const purchaseRequest = state.currents[action.materialId];
        state.updates[action.materialId] = {
          ...purchaseRequest,
          amount: action.amount,
        };
        return {
          ...state,
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
    case ActionType.SET_IS_SELECT_ALL:
      if (action.isSelectedAll !== undefined) {
        const isSelectAll = action.isSelectedAll ?? false;
        const selectedMaterialIds = isSelectAll
          ? state.materialIds
          : [];
        state.isSelectAll = isSelectAll;
        return {
          ...state,
          isSelectAll,
          selectedMaterialIds,
        };
      }
      break;
  }
  return state;
}

function initRequestDetails(
  purchaseRequest: PurchaseRequest,
  materials: Map<string, Material>,
  inventories: Map<string, Inventory>,
) {
  return Object.fromEntries(
    purchaseRequest?.purchaseRequestDetails.map((e) => [
      e.materialId,
      initRequestDetail(e, materials, inventories),
    ]),
  );
}

function initRequestDetail(
  purchaseRequestDetail: PurchaseRequestDetail,
  materials: Map<string, Material>,
  inventories: Map<string, Inventory>,
) {
  const material = materials.get(purchaseRequestDetail.materialId);
  const amount = convertAmount({
    material,
    amount: purchaseRequestDetail.amount,
    reverse: true,
  });
  const inventory = convertAmount({
    material,
    amount:
      inventories.get(purchaseRequestDetail.materialId)?.amount || 0,
    reverse: true,
  });
  const minimumAmount = convertAmount({
    material,
    amount:
      inventories.get(purchaseRequestDetail.materialId)
        ?.minimumAmount || 0,
    reverse: true,
  });
  return {
    id: purchaseRequestDetail.id,
    materialId: purchaseRequestDetail.materialId,
    inventory,
    needToOrder: roundToDecimals(minimumAmount - inventory, 3),
    amount: amount,
    supplierNote: purchaseRequestDetail.others.supplierNote || "",
    internalNote: purchaseRequestDetail.others.internalNote || "",
    price: purchaseRequestDetail.others.price,
  };
}

function sortMaterialIds(currents: Record<string, RequestDetail>) {
  const materialIds = Object.keys(currents);
  const nonZeroPriceIds = materialIds.filter(
    (materialId) => currents[materialId]?.price !== 0,
  );
  const zeroPriceIds = materialIds.filter(
    (materialId) => currents[materialId]?.price === 0,
  );
  return nonZeroPriceIds.concat(zeroPriceIds);
}
