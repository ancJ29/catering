import {
  DailyMenu,
  getDailyMenu,
  pushDailyMenu,
} from "@/services/domain";
import useCustomerStore from "@/stores/customer.store";
import {
  cloneDeep,
  createStore,
  formatTime,
  ONE_WEEK,
} from "@/utils";

type State = {
  currents: Record<string, DailyMenu>;
  updates: Record<string, DailyMenu>;
  dailyMenu: Record<string, DailyMenu[]>;
  selectedCateringId: string;
  date: number;
  from: number;
  to: number;
};

export enum ActionType {
  RESET = "RESET",
  // INIT_DATA = "INIT_DATA",
  SET_CATERING_ID = "SET_CATERING_ID",
  SET_DATE = "SET_DATE",
  SET_ESTIMATED_QUANTITY = "SET_ESTIMATED_QUANTITY",
  SET_PRODUCTION_ORDER_QUANTITY = "SET_PRODUCTION_ORDER_QUANTITY",
  SET_EMPLOYEE_QUANTITY = "SET_EMPLOYEE_QUANTITY",
  SET_PAYMENT_QUANTITY = "SET_PAYMENT_QUANTITY",
}

type Action = {
  type: ActionType;
  dailyMenus?: DailyMenu[];
  quantity?: number;
  cateringId?: string | null;
  date?: number;
  mealId?: string;
};

const defaultState = {
  currents: {},
  updates: {},
  dailyMenu: {},
  selectedCateringId: "",
  date: new Date().getTime(),
  from: Date.now() - ONE_WEEK,
  to: Date.now() + ONE_WEEK,
};

const { dispatch, ...store } = createStore<State, Action>(reducer, {
  ...defaultState,
});

export default {
  ...store,
  // async initData() {
  //   const meals = await getDailyMenu();
  //   dispatch({
  //     type: ActionType.INIT_DATA,
  //     meals,
  //   });
  // },
  async setSelectedCateringId(cateringId: string | null) {
    if (cateringId === null) {
      dispatch({ type: ActionType.RESET });
    } else {
      const { customersByCateringId } = useCustomerStore.getState();
      const state = store.getSnapshot();
      const customers = customersByCateringId.get(cateringId);
      const dailyMenus = await getDailyMenu({
        from: state.from,
        to: state.to,
        customerIds: customers?.map((customer) => customer.id) || [],
      });
      dispatch({
        type: ActionType.SET_CATERING_ID,
        cateringId,
        dailyMenus,
      });
    }
  },
  async setDate(date?: number) {
    const state = store.getSnapshot();
    if (date && (date > state.to || date < state.from)) {
      if (date > state.to) {
        state.to = date;
      } else if (date < state.from) {
        state.from = date;
      }
      const { customersByCateringId } = useCustomerStore.getState();
      const customers = customersByCateringId.get(
        state.selectedCateringId,
      );
      const dailyMenus = await getDailyMenu({
        from: state.from,
        to: state.to,
        customerIds: customers?.map((customer) => customer.id) || [],
      });
      dispatch({
        type: ActionType.SET_CATERING_ID,
        cateringId: state.selectedCateringId,
        dailyMenus,
        date,
      });
    } else {
      dispatch({ type: ActionType.SET_DATE, date });
    }
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
    Object.values(state.updates).map(async (el) => {
      await pushDailyMenu({
        customerId: el.customerId,
        date: new Date(el.date),
        targetName: el.others.targetName,
        shift: el.others.shift,
        price: el.others.price || 0,
        quantity: el.others.quantity,
        estimatedQuantity: el.others.estimatedQuantity,
        total: el.others.total,
        status: el.others.status,
        itemByType: el.others.itemByType,
      });
    });
  },
};

function reducer(action: Action, state: State): State {
  switch (action.type) {
    case ActionType.RESET:
      return {
        ...defaultState,
        date: state.date,
      };
    case ActionType.SET_CATERING_ID:
      if (action.cateringId && action.dailyMenus !== undefined) {
        const dailyMenu: Record<string, DailyMenu[]> = {};
        action.dailyMenus.flatMap((el) => {
          const date = formatTime(el.date, "YYYY/MM/DD");
          const dailyMenuList = dailyMenu[date] || [];
          dailyMenuList.push(el);
          dailyMenu[date] = dailyMenuList;
        });
        const currents = initDailyMenu(
          dailyMenu,
          action.date ?? state.date,
        );
        return {
          ...state,
          selectedCateringId: action.cateringId,
          currents,
          updates: cloneDeep(currents),
          dailyMenu,
          date: action.date ?? state.date,
        };
      }
      break;
    case ActionType.SET_DATE:
      if (action.date) {
        if (
          state.selectedCateringId === "" ||
          state.selectedCateringId === null
        ) {
          return {
            ...state,
            date: action.date,
          };
        }
        const currents = initDailyMenu(state.dailyMenu, action.date);
        return {
          ...state,
          currents,
          updates: cloneDeep(currents),
          date: action.date,
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
            total: action.quantity,
          },
        };
      }
      break;
  }
  return state;
}

function initDailyMenu(
  dailyMenu: Record<string, DailyMenu[]>,
  date: number,
) {
  const dateString = formatTime(date, "YYYY/MM/DD");
  const dailyMenus = dailyMenu[dateString];
  const currents: Record<string, DailyMenu> = {};
  dailyMenus?.forEach((dailyMenu) => {
    currents[dailyMenu.id] = dailyMenu;
  });
  return currents;
}