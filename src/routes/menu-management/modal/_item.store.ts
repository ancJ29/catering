import { createStore } from "@/utils";

export type XDailyMenu = {
  others: {
    quantity: Record<string, number>;
  };
};
type State = {
  originItem?: XDailyMenu;
  item: XDailyMenu;
  productIds: string[];
  updated?: boolean;
};

// prettier-ignore
type ActionType = "RESET" | "SET" | "SET_QUANTITY" | "ADD_PRODUCT" | "REMOVE_PRODUCT";

type Action = {
  type: ActionType;
  payload?: XDailyMenu;
  productId?: string;
  quantity?: number;
};

const defaultState: State = {
  productIds: [],
  item: {
    others: {
      quantity: {},
    },
  },
};

const { dispatch, ...store } = createStore<State, Action>(
  reducer,
  defaultState,
);

export default {
  dispatch,
  ...store,
  set(item?: XDailyMenu) {
    dispatch({ type: "SET", payload: item });
  },
  setQuantity(productId: string, quantity: number) {
    dispatch({ type: "SET_QUANTITY", productId, quantity });
  },
  addProduct(productId: string) {
    dispatch({ type: "ADD_PRODUCT", productId });
  },
  removeProduct(productId: string) {
    dispatch({ type: "REMOVE_PRODUCT", productId });
  },
  reset() {
    dispatch({ type: "RESET" });
  },
};

function reducer(action: Action, state: State): State {
  switch (action.type) {
    case "RESET":
      return defaultState;
    case "SET":
      if (action.payload) {
        return {
          originItem: action.payload,
          item: {
            others: {
              quantity: {
                ...action.payload.others.quantity,
              },
            },
          },
          productIds: Object.keys(action.payload.others.quantity),
          updated: false,
        };
      }
      return defaultState;
    case "ADD_PRODUCT":
      if (action.productId) {
        const currentQuantity =
          state.item.others.quantity[action.productId] || 0;
        state.item.others.quantity[action.productId] =
          currentQuantity + 1;
        return {
          item: state.item,
          productIds: Object.keys(state.item.others.quantity),
          updated: true,
        };
      }
      break;
    case "REMOVE_PRODUCT":
      if (action.productId) {
        delete state.item.others.quantity[action.productId];
        return {
          item: state.item,
          productIds: Object.keys(state.item.others.quantity),
          updated: true,
        };
      }
      break;
    case "SET_QUANTITY":
      if (!state.item) {
        break;
      }
      if (action.productId && action.quantity !== undefined) {
        state.item.others.quantity[action.productId] =
          action.quantity;
      }
      return {
        item: state.item,
        productIds: state.productIds,
        updated: true,
      };
    default:
      return state;
  }
  return state;
}
