import { Customer, Target } from "@/services/domain";
export enum Tab {
  STANDARD = "standard",
  CUSTOMIZED = "customized",
}

export type FilterType = {
  productId?: string;
  tab: Tab;
  customer?: Customer;
  target?: Target;
  shift?: string;
  cateringId?: string;
};

export enum ActionType {
  CHANGE_TAB = "CHANGE_TAB",
  OVERRIDE = "OVERRIDE",
  CLEAR = "CLEAR",
  CLEAR_PRODUCT_ID = "CLEAR_PRODUCT_ID",
  UPDATE_CUSTOMER = "UPDATE_CUSTOMER",
  UPDATE_CATERING_ID = "UPDATE_CATERING_ID",
}

export const defaultCondition: FilterType = {
  tab: Tab.STANDARD,
};

export function _customizeKey(condition: FilterType) {
  if (condition.tab === Tab.STANDARD) {
    return "";
  }

  if (!condition.cateringId) {
    return "";
  }

  return condition.cateringId;

  // return [
  //   condition.customer?.id || "",
  //   condition.target?.name || "",
  //   condition.shift || "",
  // ]
  //   .filter(Boolean)
  //   .join(".");
}

export const reducer = (
  state: FilterType,
  action: {
    type: ActionType;
    tab?: Tab;
    keys?: ("customer" | "target" | "shift" | "cateringId")[];
    productId?: string;
    overrideState?: Partial<FilterType>;
    cateringId?: string;
    customer?: Customer;
  },
): FilterType => {
  let _state: FilterType;
  switch (action.type) {
    case ActionType.OVERRIDE:
      if (action.overrideState) {
        return {
          ...state,
          ...action.overrideState,
        };
      }
      break;
    case ActionType.CHANGE_TAB:
      if (action.tab) {
        return {
          ...state,
          tab: action.tab,
        };
      }
      break;
    case ActionType.CLEAR_PRODUCT_ID:
      return {
        ...state,
        productId: undefined,
      };
    // TODO: move to common
    case ActionType.UPDATE_CATERING_ID:
      _state = { ...state };
      delete _state.cateringId;
      if (action.cateringId) {
        _state.cateringId = action.cateringId;
        if (_state.customer) {
          if (
            _state.customer.others.cateringId !== action.cateringId
          ) {
            delete _state.customer;
            delete _state.target;
            delete _state.shift;
          }
        }
        return _state;
      }
      break;
    case ActionType.UPDATE_CUSTOMER:
      _state = { ...state };
      delete _state.customer;
      delete _state.target;
      delete _state.shift;
      if (action.customer) {
        _state.customer = action.customer;
        _state.target = undefined;
        _state.shift = undefined;
      }
      return _state;
    case ActionType.CLEAR:
      if (action.keys?.length) {
        const _state = { ...state };
        for (const key of action.keys) {
          delete _state[key];
        }
        return _state;
      }
      break;
    default:
      break;
  }
  return state;
};
