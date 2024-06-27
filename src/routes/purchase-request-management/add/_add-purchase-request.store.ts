import Action from "@/components/common/Action";
import {
  Inventory,
  Material,
  PreferredSupplier,
  addPurchaseRequest,
  getAllDailyMenuInventories,
  getAllInventories,
  getAllLowInventories,
  getAllPeriodicInventories,
  getPreferredSuppliersByDepartmentId,
} from "@/services/domain";
import useMaterialStore from "@/stores/material.store";
import {
  MaterialExcel,
  PurchaseRequestForm,
  RequestDetail,
} from "@/types";
import { cloneDeep, createStore } from "@/utils";
import { getConvertedAmount, roundToDecimals } from "@/utils/unit";

type State = {
  currents: Record<string, RequestDetail>;
  updates: Record<string, RequestDetail>;
  isSelectAll: boolean;
  materialIds: string[];
  selectedMaterialIds: string[];
  inventories: Record<string, Inventory>;
  preferredSuppliers: Record<string, PreferredSupplier>;
  internalCodeInventories: Record<string, Inventory>;
};

export enum ActionType {
  RESET = "RESET",
  INIT_DATA = "INIT_DATA",
  INIT_BACKGROUND_DATA = "INIT_BACKGROUND_DATA",
  IMPORT_FROM_EXCEL = "IMPORT_FROM_EXCEL",
  ADD_MATERIAL = "ADD_MATERIAL",
  REMOVE_MATERIAL = "REMOVE_MATERIAL",
  SET_IS_SELECTED = "SET_IS_SELECTED",
  SET_AMOUNT = "SET_AMOUNT",
  SET_SUPPLIER_NOTE = "SET_SUPPLIER_NOTE",
  SET_INTERNAL_NOTE = "SET_INTERNAL_NOTE",
  SET_IS_SELECT_ALL = "SET_IS_SELECT_ALL",
}

type Action = {
  type: ActionType;
  cateringId?: string;
  inventories?: Inventory[];
  preferredSuppliers?: PreferredSupplier[];
  materialId?: string;
  amount?: number;
  note?: string;
  isSelected?: boolean;
  isSelectedAll?: boolean;
  materials?: MaterialExcel[];
};

const defaultState = {
  currents: {},
  updates: {},
  isSelectAll: true,
  materialIds: [],
  selectedMaterialIds: [],
  inventories: {},
  preferredSuppliers: {},
  internalCodeInventories: {},
};

const { dispatch, ...store } = createStore<State, Action>(reducer, {
  ...defaultState,
});

export default {
  ...store,
  async reset(cateringId?: string) {
    if (cateringId) {
      const inventories = await getAllInventories(cateringId);
      const preferredSuppliers =
        await getPreferredSuppliersByDepartmentId(cateringId);
      dispatch({
        type: ActionType.RESET,
        inventories,
        preferredSuppliers,
      });
    } else {
      dispatch({
        type: ActionType.RESET,
      });
    }
  },
  async initBackgroundData(cateringId: string) {
    const inventories = await getAllInventories(cateringId);
    const preferredSuppliers =
      await getPreferredSuppliersByDepartmentId(cateringId);
    dispatch({
      type: ActionType.INIT_BACKGROUND_DATA,
      inventories,
      preferredSuppliers,
    });
  },
  async loadLowInventories(cateringId: string) {
    const inventories = await getAllLowInventories(cateringId);
    dispatch({
      type: ActionType.INIT_DATA,
      cateringId,
      inventories,
    });
  },
  async loadPeriodicInventories(cateringId: string) {
    const inventories = await getAllPeriodicInventories(cateringId);
    dispatch({
      type: ActionType.INIT_DATA,
      cateringId,
      inventories,
    });
  },
  async loadDailyMenuInventories(cateringId: string) {
    const inventories = await getAllDailyMenuInventories(cateringId);
    dispatch({
      type: ActionType.INIT_DATA,
      cateringId,
      inventories,
    });
  },
  loadDataFromExcel(materials: MaterialExcel[]) {
    dispatch({
      type: ActionType.IMPORT_FROM_EXCEL,
      materials,
    });
  },
  addMaterial(materialId: string) {
    dispatch({
      type: ActionType.ADD_MATERIAL,
      materialId,
    });
  },
  removeMaterial(materialId: string) {
    dispatch({
      type: ActionType.REMOVE_MATERIAL,
      materialId,
    });
  },
  getTotalMaterial() {
    return store.getSnapshot().selectedMaterialIds.length;
  },
  getTotalPrice() {
    const state = store.getSnapshot();
    const total = state.selectedMaterialIds.reduce(
      (sum, materialId) => {
        const price =
          state.preferredSuppliers[materialId]?.price || 0;
        const amount = state.updates[materialId].amount;
        return sum + price * amount;
      },
      0,
    );
    return total;
  },
  getPrice(materialId: string) {
    return (
      store.getSnapshot().preferredSuppliers[materialId]?.price || 0
    );
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
  async createPurchasingRequest(
    purchaseRequest: PurchaseRequestForm,
  ) {
    const state = store.getSnapshot();
    const { materials } = useMaterialStore.getState();
    await addPurchaseRequest(
      purchaseRequest,
      state.selectedMaterialIds.map((materialId) => {
        const material = materials.get(materialId);
        return {
          ...state.updates[materialId],
          amount: getConvertedAmount({
            material,
            amount: state.updates[materialId].amount,
          }),
          price: state.preferredSuppliers[materialId]?.price || 0,
        };
      }),
    );
    dispatch({ type: ActionType.RESET });
  },
};

function reducer(action: Action, state: State): State {
  const { materials } = useMaterialStore.getState();
  switch (action.type) {
    case ActionType.RESET: {
      if (action.inventories && action.preferredSuppliers) {
        const inventories = Object.fromEntries(
          action.inventories.map((inventory) => [
            inventory.materialId,
            inventory,
          ]),
        );
        const internalCodeInventories = Object.fromEntries(
          action.inventories.map((inventory) => [
            inventory.others.materialInternalCode,
            inventory,
          ]),
        );
        const preferredSuppliers = Object.fromEntries(
          action.preferredSuppliers.map((preferredSupplier) => [
            preferredSupplier.materialId,
            preferredSupplier,
          ]),
        );
        return {
          ...defaultState,
          inventories,
          internalCodeInventories,
          preferredSuppliers,
          updates: {},
          currents: {},
        };
      } else {
        return {
          ...defaultState,
          updates: {},
          currents: {},
        };
      }
    }
    case ActionType.INIT_BACKGROUND_DATA: {
      if (action.inventories && action.preferredSuppliers) {
        const inventories = Object.fromEntries(
          action.inventories.map((inventory) => [
            inventory.materialId,
            inventory,
          ]),
        );
        const internalCodeInventories = Object.fromEntries(
          action.inventories.map((inventory) => [
            inventory.others.materialInternalCode,
            inventory,
          ]),
        );
        const preferredSuppliers = Object.fromEntries(
          action.preferredSuppliers.map((preferredSupplier) => [
            preferredSupplier.materialId,
            preferredSupplier,
          ]),
        );
        return {
          ...state,
          inventories,
          internalCodeInventories,
          preferredSuppliers,
        };
      }
      break;
    }
    case ActionType.INIT_DATA:
      if (action.inventories && action.cateringId) {
        const currents = initPurchaseDetails(
          action.inventories,
          materials,
        );
        const materialIds = sortMaterialIds(
          currents,
          state.preferredSuppliers,
        );
        return {
          ...state,
          currents,
          updates: cloneDeep(currents),
          materialIds,
          selectedMaterialIds: materialIds,
        };
      }
      break;
    case ActionType.IMPORT_FROM_EXCEL:
      if (action.materials) {
        action.materials.map((e) => {
          const inventory =
            state.internalCodeInventories[e.materialInternalCode];
          if (inventory) {
            state.currents[inventory.materialId] = initPurchaseDetail(
              inventory,
              materials,
            );
          }
        });
        const materialIds = sortMaterialIds(
          state.currents,
          state.preferredSuppliers,
        );
        return {
          ...state,
          currents: state.currents,
          updates: cloneDeep(state.currents),
          materialIds,
          selectedMaterialIds: materialIds,
        };
      }
      break;
    case ActionType.ADD_MATERIAL:
      if (
        action.materialId &&
        !(action.materialId in state.currents)
      ) {
        const inventory = state.inventories[action.materialId];
        if (inventory) {
          state.currents[action.materialId] = initPurchaseDetail(
            inventory,
            materials,
          );
          state.updates[action.materialId] =
            state.currents[action.materialId];
        }
        return {
          ...state,
          materialIds: [...state.materialIds, action.materialId],
          selectedMaterialIds: [
            ...state.materialIds,
            action.materialId,
          ],
        };
      }
      break;
    case ActionType.REMOVE_MATERIAL:
      if (action.materialId && action.materialId in state.currents) {
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
        state.updates[action.materialId] = {
          ...state.updates[action.materialId],
          amount: action.amount,
        };
        return {
          ...state,
        };
      }
      break;
    case ActionType.SET_SUPPLIER_NOTE:
      if (action.materialId && action.note) {
        state.updates[action.materialId] = {
          ...state.updates[action.materialId],
          supplierNote: action.note,
        };
      }
      break;
    case ActionType.SET_INTERNAL_NOTE:
      if (action.materialId && action.note) {
        state.updates[action.materialId] = {
          ...state.updates[action.materialId],
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

function initPurchaseDetails(
  inventories: Inventory[],
  materials: Map<string, Material>,
) {
  return Object.fromEntries(
    inventories.map((inventory) => [
      inventory.materialId,
      initPurchaseDetail(inventory, materials),
    ]),
  );
}

function initPurchaseDetail(
  inventory: Inventory,
  materials: Map<string, Material>,
) {
  const material = materials.get(inventory.materialId);
  const amount = getConvertedAmount({
    material,
    amount: inventory.amount,
    reverse: true,
  });
  const minimumAmount = getConvertedAmount({
    material,
    amount: inventory.minimumAmount,
    reverse: true,
  });
  return {
    materialId: inventory.materialId,
    inventory: amount,
    needToOrder: roundToDecimals(minimumAmount - amount, 3),
    amount: roundToDecimals(minimumAmount - amount, 3),
    supplierNote: "",
    internalNote: "",
  };
}

function sortMaterialIds(
  currents: Record<string, RequestDetail>,
  preferredSuppliers: Record<string, PreferredSupplier>,
) {
  const materialIds = Object.keys(currents);
  const nonZeroPriceIds = materialIds.filter(
    (materialId) =>
      preferredSuppliers[materialId]?.price !== undefined,
  );
  const zeroPriceIds = materialIds.filter(
    (materialId) =>
      preferredSuppliers[materialId]?.price === undefined,
  );
  return nonZeroPriceIds.concat(zeroPriceIds);
}
