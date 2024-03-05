import { ProductType } from "@/auto-generated/api-configs";
import { DailyMenuStatus } from "@/services/domain";
import { createStore } from "@/utils";

export type XDailyMenu = {
  id: string;
  others: {
    price?: number;
    itemByType?: Record<string, number>;
    cateringId: string;
    status: DailyMenuStatus;
    quantity: Record<string, number>;
    total?: number;
  };
};

type State = {
  originItem?: XDailyMenu;
  item: XDailyMenu;
  productIds: string[];
  updated?: boolean;
};

enum ActionType {
  RESET = "RESET",
  SET = "SET",
  SET_PRICE = "SET_PRICE",
  SET_ITEM_BY_TYPE = "SET_ITEM_BY_TYPE",
  SET_QUANTITY = "SET_QUANTITY",
  ADD_PRODUCT = "ADD_PRODUCT",
  REMOVE_PRODUCT = "REMOVE_PRODUCT",
  SET_STATUS = "SET_STATUS",
  SET_TOTAL = "SET_TOTAL",
}

type Action = {
  type: ActionType;
  productType?: ProductType;
  payload?: XDailyMenu;
  productId?: string;
  quantity?: number;
  status?: DailyMenuStatus;
  total?: number;
  price?: number;
};

const { dispatch, ...store } = createStore<State, Action>(reducer, {
  productIds: [],
  item: {
    id: "",
    others: {
      price: 0,
      total: 0,
      itemByType: {},
      cateringId: "",
      status: "NEW",
      quantity: {},
    },
  },
});

export default {
  dispatch,
  ...store,
  set(item?: XDailyMenu) {
    dispatch({ type: ActionType.SET, payload: item });
  },
  setPrice(price: number) {
    dispatch({
      type: ActionType.SET_PRICE, price,
    });
  },
  setItemByType(type: ProductType, quantity: number) {
    dispatch({
      type: ActionType.SET_ITEM_BY_TYPE,
      productType: type,
      quantity,
    });
  },
  setTotal(total: number) {
    dispatch({ type: ActionType.SET_TOTAL, total });
  },
  setQuantity(productId: string, quantity: number) {
    dispatch({ type: ActionType.SET_QUANTITY, productId, quantity });
  },
  setStatus(status: DailyMenuStatus) {
    dispatch({ type: ActionType.SET_STATUS, status });
  },
  addProduct(productId: string) {
    dispatch({ type: ActionType.ADD_PRODUCT, productId });
  },
  removeProduct(productId: string) {
    dispatch({ type: ActionType.REMOVE_PRODUCT, productId });
  },
  reset() {
    dispatch({ type: ActionType.RESET });
  },
};

function reducer(action: Action, state: State): State {
  const defaultState = {
    productIds: [],
    item: {
      id: "",
      others: {
        price: 0,
        cateringId: "",
        status: "NEW" as DailyMenuStatus,
        quantity: {},
      },
    },
  };
  switch (action.type) {
    case "RESET":
      return defaultState;
    case "SET_ITEM_BY_TYPE":
      if (state.item && action.productType) {
        if (!state.item.others.itemByType) {
          state.item.others.itemByType = {};
        }
        state.item.others.itemByType[action.productType] =
          action.quantity || 0;
        return { ...state, updated: true };
      }
      break;
    case "SET_PRICE":
      if (state.item) {
        state.item.others.price = action.price || 0;
        return { ...state, updated: true };
      }
      break;
    case "SET_TOTAL":
      if (state.item) {
        state.item.others.total = action.total || 0;
        return { ...state, updated: true };
      }
      break;
    case "SET":
      if (action.payload) {
        return {
          originItem: action.payload,
          item: {
            id: action.payload?.id || "",
            others: {
              price: action.payload.others.price || 0,
              itemByType: action.payload.others.itemByType || {},
              total: action.payload.others.total || 0,
              cateringId: action.payload.others.cateringId,
              status: action.payload.others.status,
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
    case "SET_STATUS":
      if (state.item && action.status) {
        state.item.others.status = action.status;
        return { ...state, updated: true };
      }
      break;
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
        item: { ...state.item },
        productIds: state.productIds,
        updated: true,
      };
    default:
      return state;
  }
  return state;
}
