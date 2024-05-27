import {
  Inventory,
  addPurchaseRequest,
  getAllDailyMenuInventories,
  getAllInventories,
  getAllLowInventories,
  getAllPeriodicInventories,
} from "@/services/domain";
import { cloneDeep, createStore } from "@/utils";
import { AddPurchaseRequestForm, PurchaseDetail } from "./_config";

type State = {
  currents: Record<string, PurchaseDetail>;
  updates: Record<string, PurchaseDetail>;
  isSelectAll: boolean;
  count: number;
  materialIds: string[];
  selectedMaterialIds: string[];
  inventories: Record<string, Inventory>;
};

export enum ActionType {
  RESET = "RESET",
  INIT_DATA = "INIT_DATA",
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
  count: 0,
  materialIds: [],
  selectedMaterialIds: [],
  inventories: {},
};

const { dispatch, ...store } = createStore<State, Action>(reducer, {
  ...defaultState,
});

export default {
  ...store,
  async reset(cateringId: string) {
    const inventories = await getAllInventories(cateringId);
    dispatch({ type: ActionType.RESET, inventories });
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
    return Object.keys(store.getSnapshot().currents).length;
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
    purchaseRequest: AddPurchaseRequestForm,
  ) {
    const state = store.getSnapshot();
    await addPurchaseRequest(
      purchaseRequest,
      state.selectedMaterialIds.map((e) => {
        return state.updates[e];
      }),
    );
    dispatch({ type: ActionType.RESET });
  },
};

function reducer(action: Action, state: State): State {
  switch (action.type) {
    case ActionType.RESET: {
      if (action.inventories) {
        const inventories = Object.fromEntries(
          action.inventories.map((inventory) => [
            inventory.materialId,
            inventory,
          ]),
        );
        return {
          ...defaultState,
          inventories,
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
    case ActionType.INIT_DATA:
      if (action.inventories && action.cateringId) {
        const currents = initInventories(action.inventories);
        state.count === action.inventories.length;
        return {
          ...defaultState,
          currents,
          updates: cloneDeep(currents),
          materialIds: Object.keys(currents),
          selectedMaterialIds: Object.keys(currents),
        };
      }
      break;
    case ActionType.IMPORT_FROM_EXCEL:
      break;
    case ActionType.ADD_MATERIAL:
      if (
        action.materialId &&
        !(action.materialId in state.currents)
      ) {
        const inventory = state.inventories[action.materialId];
        state.currents[action.materialId] = {
          materialId: action.materialId,
          inventory: inventory.amount,
          needToOrder: inventory.minimumAmount - inventory.amount,
          amount: inventory.minimumAmount - inventory.amount,
          difference: 0,
          supplierNote: "",
          internalNote: "",
        };
        state.updates[action.materialId] =
          state.currents[action.materialId];
        state.count += 1;
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
        state.count -= 1;
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
        state.count = action.isSelected
          ? state.count + 1
          : state.count - 1;
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

function initInventories(inventories: Inventory[]) {
  return Object.fromEntries(
    inventories.map((inventory) => [
      inventory.materialId,
      {
        isSelected: true,
        materialId: inventory.materialId,
        inventory: inventory.amount,
        needToOrder: inventory.minimumAmount - inventory.amount,
        amount: inventory.minimumAmount - inventory.amount,
        difference: 0,
        supplierNote: "",
        internalNote: "",
      },
    ]),
  );
}
