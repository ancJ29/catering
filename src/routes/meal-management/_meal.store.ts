import {
  Customer,
  getAllMeals,
  Meal,
  updateMeal,
} from "@/services/domain";
import useCustomerStore from "@/stores/customer.store";
import { cloneDeep, createStore, isSameDate } from "@/utils";

type State = {
  currents: Record<string, Meal>;
  updates: Record<string, Meal>;
  meals: Record<string, Meal[]>;
  selectedCateringId: string;
  date: number;
};

export enum ActionType {
  RESET = "RESET",
  INIT_DATA = "INIT_DATA",
  SET_CATERING_ID = "SET_CATERING_ID",
  SET_DATE = "SET_DATE",
  SET_ESTIMATED_QUANTITY = "SET_ESTIMATED_QUANTITY",
  SET_PRODUCTION_ORDER_QUANTITY = "SET_PRODUCTION_ORDER_QUANTITY",
  SET_EMPLOYEE_QUANTITY = "SET_EMPLOYEE_QUANTITY",
  SET_PAYMENT_QUANTITY = "SET_PAYMENT_QUANTITY",
}

type Action = {
  type: ActionType;
  meals?: Meal[];
  quantity?: number;
  cateringId?: string | null;
  date?: number;
  mealId?: string;
};

const defaultState = {
  currents: {},
  updates: {},
  meals: {},
  selectedCateringId: "",
  date: new Date().getTime(),
};

const { dispatch, ...store } = createStore<State, Action>(reducer, {
  ...defaultState,
});

export default {
  ...store,
  async initData() {
    const meals = await getAllMeals();
    dispatch({
      type: ActionType.INIT_DATA,
      meals,
    });
  },
  setSelectedCateringId(cateringId: string | null) {
    dispatch({
      type:
        cateringId === null
          ? ActionType.RESET
          : ActionType.SET_CATERING_ID,
      cateringId,
    });
  },
  setDate(date?: number) {
    dispatch({ type: ActionType.SET_DATE, date });
  },
  setEstimatedQuantity(mealId: string, quantity: number) {
    dispatch({
      type: ActionType.SET_ESTIMATED_QUANTITY,
      quantity,
      mealId,
    });
  },
  setProductionOrderQuantity(mealId: string, quantity: number) {
    dispatch({
      type: ActionType.SET_PRODUCTION_ORDER_QUANTITY,
      quantity,
      mealId,
    });
  },
  setEmployeeQuantity(mealId: string, quantity: number) {
    dispatch({
      type: ActionType.SET_EMPLOYEE_QUANTITY,
      quantity,
      mealId,
    });
  },
  setPaymentQuantity(mealId: string, quantity: number) {
    dispatch({
      type: ActionType.SET_PAYMENT_QUANTITY,
      quantity,
      mealId,
    });
  },
  async save() {
    const state = store.getSnapshot();
    await updateMeal(
      Object.values(state.updates).map((el) => ({
        ...el,
        date: new Date(el.date),
      })),
    );
  },
};

function reducer(action: Action, state: State): State {
  const { customersByCateringId } = useCustomerStore.getState();
  switch (action.type) {
    case ActionType.RESET:
      return {
        ...defaultState,
        meals: state.meals,
        date: state.date,
      };
    case ActionType.INIT_DATA:
      if (action.meals !== undefined) {
        const meals: Record<string, Meal[]> = {};
        action.meals.flatMap((meal) => {
          const mealList = meals[meal.customerId] || [];
          mealList.push(meal);
          meals[meal.customerId] = mealList;
        });
        return {
          ...state,
          meals,
        };
      }
      break;
    case ActionType.SET_CATERING_ID:
      if (action.cateringId) {
        const customers = customersByCateringId.get(
          action.cateringId,
        );
        const currents = initMeal(state.meals, state.date, customers);
        return {
          ...state,
          selectedCateringId: action.cateringId,
          currents,
          updates: cloneDeep(currents),
        };
      }
      break;
    case ActionType.SET_DATE:
      if (action.date) {
        const customers = customersByCateringId.get(
          state.selectedCateringId,
        );
        const currents = initMeal(
          state.meals,
          action.date,
          customers,
        );
        return {
          ...state,
          date: action.date,
          currents,
          updates: cloneDeep(currents),
        };
      }
      break;
    case ActionType.SET_ESTIMATED_QUANTITY:
      if (action.mealId && action.quantity) {
        state.updates[action.mealId] = {
          ...state.updates[action.mealId],
          others: {
            ...state.updates[action.mealId].others,
            estimatedQuantity: action.quantity,
          },
        };
      }
      break;
    case ActionType.SET_PRODUCTION_ORDER_QUANTITY:
      if (action.mealId && action.quantity) {
        state.updates[action.mealId] = {
          ...state.updates[action.mealId],
          others: {
            ...state.updates[action.mealId].others,
            productionOrderQuantity: action.quantity,
          },
        };
      }
      break;
    case ActionType.SET_EMPLOYEE_QUANTITY:
      if (action.mealId && action.quantity) {
        state.updates[action.mealId] = {
          ...state.updates[action.mealId],
          others: {
            ...state.updates[action.mealId].others,
            employeeQuantity: action.quantity,
          },
        };
      }
      break;
    case ActionType.SET_PAYMENT_QUANTITY:
      if (action.mealId && action.quantity) {
        state.updates[action.mealId] = {
          ...state.updates[action.mealId],
          others: {
            ...state.updates[action.mealId].others,
            paymentQuantity: action.quantity,
          },
        };
      }
      break;
  }
  return state;
}

function initMeal(
  meals: Record<string, Meal[]>,
  date: number,
  customers?: Customer[],
) {
  const currents: Record<string, Meal> = {};
  const _date = new Date(date);
  customers?.forEach((customer) => {
    const _meals = meals[customer.id];
    if (_meals) {
      _meals.forEach((meal) => {
        if (isSameDate(meal.date, _date)) {
          currents[meal.id] = meal;
        }
      });
    }
  });
  return currents;
}
