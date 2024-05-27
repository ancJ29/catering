import {
  Inventory,
  getInventories,
} from "@/services/domain/inventory";
import { createStore, isSameDate } from "@/utils";

type State = {
  updated: boolean;
  cateringId?: string;
  updates: Record<string, Inventory>;
  currents: Record<string, Inventory>;
};

export enum ActionType {
  RESET = "RESET",
  SET_INVENTORY = "SET_INVENTORY",
  SET_AMOUNT = "SET_AMOUNT",
}

type Action = {
  type: ActionType;
  cateringId?: string;
  inventories?: Inventory[];
  amount?: number;
  minimumAmount?: number;
  materialId?: string;
};

const defaultState: State = {
  updated: false,
  currents: {},
  updates: {},
};

const { dispatch, ...store } = createStore<State, Action>(reducer, {
  ...defaultState,
});

export default {
  ...store,
  async load(cateringId: string) {
    const inventories = await getInventories(cateringId);
    dispatch({
      type: ActionType.SET_INVENTORY,
      cateringId,
      inventories,
    });
  },
  setAmount(materialId: string, amount: number) {
    dispatch({ type: ActionType.SET_AMOUNT, materialId, amount });
  },
  getAmount(materialId: string) {
    return store.getSnapshot().currents[materialId]?.amount || 0;
  },
  markChecked(materialId: string) {
    const state = store.getSnapshot();
    const amount =
      state.updates[materialId]?.amount ||
      state.currents[materialId]?.amount ||
      0;
    dispatch({ type: ActionType.SET_AMOUNT, materialId, amount });
  },
  checked(materialId: string) {
    const updatedAt =
      store.getSnapshot().currents[materialId]?.updatedAt;
    if (!updatedAt) {
      return false;
    }
    return isSameDate(new Date(), updatedAt);
  },
  getInventory(materialId: string) {
    return store.getSnapshot().currents[materialId];
  },
  getUpdates() {
    return Object.values(store.getSnapshot().updates);
  },
  reset() {
    dispatch({ type: ActionType.RESET });
  },
};

function reducer(action: Action, state: State): State {
  let updates: Record<string, Inventory> = {};
  switch (action.type) {
    case ActionType.RESET:
      return { ...defaultState };
    case ActionType.SET_INVENTORY:
      if (action.inventories && action.cateringId) {
        return {
          ...defaultState,
          cateringId: action.cateringId,
          currents: Object.fromEntries(
            action.inventories.map((inventory) => [
              inventory.materialId,
              inventory,
            ]),
          ),
        };
      }
      break;
    case ActionType.SET_AMOUNT:
      if (state.cateringId && action.materialId) {
        if (state.updates[action.materialId]) {
          updates = {
            ...state.updates,
            [action.materialId]: {
              ...state.updates[action.materialId],
              amount: action.amount || 0,
            },
          };
          return { ...state, updates, updated: true };
        }
        if (state.currents[action.materialId]) {
          updates = {
            ...state.updates,
            [action.materialId]: {
              ...state.currents[action.materialId],
              amount: action.amount || 0,
            },
          };
          return { ...state, updates, updated: true };
        }
        updates = {
          ...state.updates,
          [action.materialId]: {
            id: "",
            others: {},
            departmentId: state.cateringId,
            materialId: action.materialId,
            amount: action.amount || 0,
            minimumAmount: action.minimumAmount || 0,
            updatedAt: new Date(),
          },
        };
        return { ...state, updates, updated: true };
      }
      break;
    default:
      break;
  }
  return state;
}
