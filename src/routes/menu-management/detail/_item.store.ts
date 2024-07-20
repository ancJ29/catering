import { ProductType } from "@/auto-generated/api-configs";
import { DailyMenuStatus, getBom } from "@/services/domain";
import useMaterialStore from "@/stores/material.store";
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
    estimatedQuantity?: number;
    productionOrderQuantity?: number;
  };
};

type State = {
  originItem?: XDailyMenu;
  item: XDailyMenu;
  productIds: string[];
  updated?: boolean;
  prices: Record<string, number>; // key: product id, value: price
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
  prices?: Record<string, number>;
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
  prices: {},
});

export default {
  dispatch,
  ...store,
  async set(cateringId: string, item?: XDailyMenu) {
    if (!item) {
      return;
    }
    const { materials } = useMaterialStore.getState();
    const productIds = Object.keys(item.others.quantity);
    const prices: Record<string, number> = {};

    for (const productId of productIds) {
      const bom = await getBom(productId);
      const _bom = bom?.bom;
      if (!_bom) {
        continue;
      }
      let price = 0;
      for (const materialId of Object.keys(_bom)) {
        const amount = _bom[materialId];
        const material = materials.get(materialId);
        price +=
          (material?.others?.prices?.[cateringId]?.price ?? 0) *
          amount;
      }
      prices[productId] = price;
    }
    dispatch({ type: ActionType.SET, payload: item, prices });
  },
  getProductPriceCost(productId: string) {
    const state = store.getSnapshot();
    return state.prices[productId] || 0;
  },
  getAverageCost(productId: string) {
    const state = store.getSnapshot();
    const cost = state.prices[productId] || 0;
    const quantity = state.item?.others.quantity[productId] ?? 1;
    const total = state.item?.others.total || 1;
    return ((cost * quantity) / total).toFixed(2);
  },
  getRatio(productId: string) {
    const state = store.getSnapshot();
    const cost = state.prices[productId] || 0;
    const quantity = state.item?.others.quantity[productId] ?? 1;
    const total = state.item?.others.total || 1;
    const averageCost = (cost * quantity) / total;
    const price = state.item?.others.price || 1;
    return ((averageCost / price) * 100).toFixed(2);
  },
  getTotalCost() {
    const state = store.getSnapshot();
    let price = 0;
    for (const productId of Object.keys(state.prices)) {
      price +=
        state.prices[productId] *
        state.item?.others.quantity[productId];
    }
    return price;
  },
  setPrice(price: number) {
    dispatch({
      type: ActionType.SET_PRICE,
      price,
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
    prices: {},
  };
  switch (action.type) {
    case ActionType.RESET:
      return defaultState;
    case ActionType.SET_ITEM_BY_TYPE:
      if (state.item && action.productType) {
        if (!state.item.others.itemByType) {
          state.item.others.itemByType = {};
        }
        state.item.others.itemByType[action.productType] =
          action.quantity || 0;
        return { ...state, updated: true };
      }
      break;
    case ActionType.SET_PRICE:
      if (state.item) {
        state.item.others.price = action.price || 0;
        return { ...state, updated: true };
      }
      break;
    case ActionType.SET_TOTAL:
      if (state.item) {
        state.item.others.productionOrderQuantity = action.total || 0;
        return { ...state, updated: true };
      }
      break;
    case ActionType.SET:
      if (action.payload && action.prices) {
        return {
          originItem: action.payload,
          item: {
            id: action.payload?.id || "",
            others: {
              price: action.payload.others.price || 0,
              itemByType: action.payload.others.itemByType || {},
              total: action.payload.others.total || 0,
              productionOrderQuantity:
                action.payload.others.productionOrderQuantity || 0,
              estimatedQuantity:
                action.payload.others.estimatedQuantity || 0,
              cateringId: action.payload.others.cateringId,
              status: action.payload.others.status,
              quantity: {
                ...action.payload.others.quantity,
              },
            },
          },
          productIds: Object.keys(action.payload.others.quantity),
          updated: false,
          prices: action.prices,
        };
      }
      return defaultState;
    case ActionType.SET_STATUS:
      if (state.item && action.status) {
        state.item.others.status = action.status;
        return { ...state, updated: true };
      }
      break;
    case ActionType.ADD_PRODUCT:
      if (action.productId) {
        const currentQuantity =
          state.item.others.quantity[action.productId] || 0;
        state.item.others.quantity[action.productId] =
          currentQuantity + 1;
        return {
          item: state.item,
          productIds: Object.keys(state.item.others.quantity),
          updated: true,
          prices: state.prices,
        };
      }
      break;
    case ActionType.REMOVE_PRODUCT:
      if (action.productId) {
        delete state.item.others.quantity[action.productId];
        return {
          item: state.item,
          productIds: Object.keys(state.item.others.quantity),
          updated: true,
          prices: state.prices,
        };
      }
      break;
    case ActionType.SET_QUANTITY:
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
        prices: state.prices,
      };
    default:
      break;
  }
  return state;
}
