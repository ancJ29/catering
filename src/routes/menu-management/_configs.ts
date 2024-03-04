import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import { Customer } from "@/services/domain";
import { ONE_WEEK, startOfDay } from "@/utils";
import { z } from "zod";

const targetSchema = actionConfigs[
  Actions.GET_CUSTOMERS
].schema.response.shape.customers
  .transform((array) => {
    return array[0].others.targets;
  })
  .transform((array) => array[0]);

export type Target = z.infer<typeof targetSchema>;

// prettier-ignore
export type FilterType = {
  mode: "W" | "M";
  markDate: number;
  customer?: Customer;
  target?: Target;
  shift?: string;
  cateringId?: string;
};

export enum ActionType {
  SHIFT_MARK_DATE = "SHIFT_MARK_DATE",
  OVERRIDE = "OVERRIDE",
  CLEAR = "CLEAR",
  UPDATE_CUSTOMER = "UPDATE_CUSTOMER",
  UPDATE_CATERING_ID = "UPDATE_CATERING_ID",
}

export const reducer = (
  state: FilterType,
  action: {
    type: ActionType;
    mode?: "W" | "M";
    shift?: 0 | 1 | -1;
    cateringId?: string;
    overrideState?: Partial<FilterType>;
    keys?: ("customer" | "target" | "shift" | "cateringId")[];
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
        _state.target = action.customer.others.targets[0];
        _state.shift = action.customer.others.targets[0].shifts[0];
      }
      return _state;
    case ActionType.SHIFT_MARK_DATE:
      if (action.shift) {
        if (state.mode === "M") {
          const markDate = new Date(state.markDate);
          markDate.setMonth(markDate.getMonth() + action.shift);
          return {
            ...state,
            markDate: markDate.getTime(),
          };
        } else {
          return {
            ...state,
            markDate: state.markDate + (action.shift || 1) * ONE_WEEK,
          };
        }
      }
      break;
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
      return state;
  }
  return state;
};

export const defaultCondition: FilterType = {
  mode: "W",
  markDate: startOfDay(Date.now()),
};
