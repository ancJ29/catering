import Action from "@/components/common/Action";
import { Bom } from "@/services/domain/bom";
import materialStore from "@/stores/material.store";
import { cloneDeep, compareDeep, createStore } from "@/utils";

type State = {
  bom?: Bom;
  originalBom?: Bom;
  materialIds: string[];
  updated: boolean;
  updatedAt: number;
};

export enum ActionType {
  RESET = "RESET",
  SET = "SET",
  INIT = "INIT",
  ADD_MATERIAL = "ADD_MATERIAL",
  REMOVE_MATERIAL = "remove_material",
  SET_AMOUNT = "SET_AMOUNT",
  SET_MEMO = "SET_MEMO",
}

type Action = {
  type: ActionType;
  bom?: Bom;
  productId?: string;
  materialId?: string;
  amount?: number;
  memo?: string;
  customizedKey?: string;
};

const defaultState = {
  materialIds: [],
  updated: false,
  updatedAt: 0,
};

const { dispatch, ...store } = createStore<State, Action>(reducer, {
  ...defaultState,
});

export default {
  ...store,
  reset() {
    dispatch({ type: ActionType.RESET });
  },
  add(materialId: string) {
    dispatch({ type: ActionType.ADD_MATERIAL, materialId });
  },
  remove(materialId: string) {
    dispatch({ type: ActionType.REMOVE_MATERIAL, materialId });
  },
  setAmount(
    materialId: string,
    amount: number,
    customizedKey?: string,
  ) {
    dispatch({
      type: ActionType.SET_AMOUNT,
      materialId,
      amount,
      customizedKey,
    });
  },
  init(productId: string) {
    dispatch({ type: ActionType.INIT, productId });
  },
  set(bom: Bom) {
    dispatch({ type: ActionType.SET, bom });
  },
  setMemo(materialId: string, memo: string, customizedKey?: string) {
    dispatch({
      type: ActionType.SET_MEMO,
      materialId,
      memo,
      customizedKey,
    });
  },
  cost(customizedKey: string) {
    const state = store.getSnapshot();
    return state.bom
      ? _cost(state.bom, state.materialIds, customizedKey)
      : 0;
  },
  originCost(customizedKey: string) {
    const state = store.getSnapshot();
    return state.originalBom
      ? _cost(state.originalBom, state.materialIds, customizedKey)
      : 0;
  },
};

function _cost(
  config: Bom,
  materialIds: string[],
  customizedKey: string,
) {
  const customized = config.others.customized || {};
  const materials = materialStore.getState().materials;
  return materialIds
    .map((id) => {
      const material = materials.get(id);
      if (!material) {
        return 0;
      }
      let unit = config.bom[id] || 0;
      let cost = material.others.price || 0;
      if (customizedKey) {
        unit = customized[customizedKey]?.[id] || unit;
        cost = material.others.prices?.[customizedKey] || cost;
      }
      return unit * cost;
    })
    .reduce((a, b) => a + b, 0);
}

function reducer(action: Action, state: State): State {
  const originalBom = state.originalBom;
  let updated = false;
  let key = "";
  let customized: Record<string, Record<string, number>>;
  switch (action.type) {
    case ActionType.RESET:
      return { ...defaultState, updatedAt: Date.now() };
    case ActionType.INIT:
      if (action.productId) {
        const bom = {
          id: "",
          updatedAt: Date.now(),
          productId: action.productId,
          bom: {},
          others: {
            customized: {},
          },
        };
        return {
          bom,
          updatedAt: Date.now(),
          originalBom: cloneDeep(bom),
          materialIds: [],
          updated: false,
        };
      }
      break;
    case ActionType.SET:
      if (action.bom) {
        return {
          originalBom: cloneDeep(action.bom),
          bom: action.bom,
          materialIds: Object.keys(action.bom.bom),
          updated: false,
          updatedAt: Date.now(),
        };
      }
      break;
    case ActionType.ADD_MATERIAL:
      if (state.bom && action.materialId) {
        if (action.materialId in state.bom === false) {
          state.bom.bom[action.materialId] = 0;
          updated = !compareDeep(state.bom, state.originalBom);
          return {
            originalBom,
            updated,
            bom: { ...state.bom },
            materialIds: [...state.materialIds, action.materialId],
            updatedAt: Date.now(),
          };
        }
      }
      break;
    case ActionType.REMOVE_MATERIAL:
      if (state.bom && action.materialId) {
        if (action.materialId in state.bom.bom) {
          delete state.bom.bom[action.materialId];
          updated = !compareDeep(state.bom, state.originalBom);
          return {
            updated,
            originalBom,
            bom: { ...state.bom },
            updatedAt: Date.now(),
            materialIds: state.materialIds.filter(
              (id) => id !== action.materialId,
            ),
          };
        }
      }
      break;
    case ActionType.SET_AMOUNT:
      if (
        state.bom &&
        action.materialId &&
        action.amount !== undefined
      ) {
        if (action.materialId in state.bom.bom) {
          if (action.customizedKey) {
            customized = state.bom.others.customized || {};
            customized[action.customizedKey] =
              customized[action.customizedKey] || {};
            customized[action.customizedKey][action.materialId] =
              action.amount;
          } else {
            state.bom.bom[action.materialId] = action.amount;
          }
        }
        updated = !compareDeep(state.bom, state.originalBom);
        return { ...state, updated, updatedAt: Date.now() };
      }
      break;
    case ActionType.SET_MEMO:
      if (state.bom && action.materialId) {
        if (action.customizedKey) {
          key = `${action.customizedKey}.${action.materialId}`;
        } else {
          key = action.materialId;
        }
        if (action.memo) {
          state.bom.others.memo = {
            ...state.bom.others.memo,
            [key]: action.memo,
          };
        } else {
          if (state.bom.others?.memo?.[key]) {
            delete state.bom.others.memo[key];
          }
        }
        updated = !compareDeep(state.bom, state.originalBom);
        return {
          ...state,
          bom: { ...state.bom },
          updated,
          updatedAt: Date.now(),
        };
      }
      break;
    default:
      break;
  }
  return state;
}
