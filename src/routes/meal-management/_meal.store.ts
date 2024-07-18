import { ClientRoles } from "@/auto-generated/api-configs";
import {
  Customer,
  DailyMenu,
  getDailyMenu,
  pushDailyMenu,
} from "@/services/domain";
import useAuthStore from "@/stores/auth.store";
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
  canEditPrice: boolean;
};

export enum ActionType {
  RESET = "RESET",
  SET_CATERING_ID = "SET_CATERING_ID",
  SET_DATE = "SET_DATE",
  SET_ESTIMATED_QUANTITY = "SET_ESTIMATED_QUANTITY",
  SET_PRODUCTION_ORDER_QUANTITY = "SET_PRODUCTION_ORDER_QUANTITY",
  SET_EMPLOYEE_QUANTITY = "SET_EMPLOYEE_QUANTITY",
  SET_PAYMENT_QUANTITY = "SET_PAYMENT_QUANTITY",
  SET_PRICE = "SET_PRICE",
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
  canEditPrice: false,
};

const { dispatch, ...store } = createStore<State, Action>(reducer, {
  ...defaultState,
});

export default {
  ...store,
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
  setPrice(mealId: string, quantity: number) {
    dispatch({
      type: ActionType.SET_PRICE,
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
  const { role } = useAuthStore.getState();
  const { customers } = useCustomerStore.getState();
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
          customers,
        );
        return {
          ...state,
          selectedCateringId: action.cateringId,
          currents,
          updates: cloneDeep(currents),
          dailyMenu,
          date: action.date ?? state.date,
          canEditPrice:
            role === ClientRoles.OWNER ||
            role === ClientRoles.MANAGER,
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
        const currents = initDailyMenu(
          state.dailyMenu,
          action.date,
          customers,
        );
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
    case ActionType.SET_PRICE:
      if (action.mealId && action.quantity) {
        state.updates[action.mealId] = {
          ...state.updates[action.mealId],
          others: {
            ...state.updates[action.mealId].others,
            price: action.quantity,
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
  customers: Map<string, Customer>,
) {
  const dateString = formatTime(date, "YYYY/MM/DD");
  const dailyMenus = sortDailyMenus(dailyMenu[dateString], customers);
  const currents: Record<string, DailyMenu> = {};
  dailyMenus?.forEach((dailyMenu) => {
    currents[dailyMenu.id] = dailyMenu;
  });
  return currents;
}

function sortDailyMenus(
  dailyMenus: DailyMenu[],
  customers: Map<string, Customer>,
) {
  const compareTargetName = (a: DailyMenu, b: DailyMenu) => {
    // cspell:disable
    const priority = ["Chuyên gia", "Công nhân"];
    // cspell:enable

    const getPriority = (name: string) => {
      for (let i = 0; i < priority.length; i++) {
        if (name.startsWith(priority[i])) {
          const number = parseInt(
            name.replace(priority[i], "").trim(),
          );
          return {
            priority: i,
            number: isNaN(number) ? Infinity : number,
          };
        }
      }
      return { priority: priority.length, number: Infinity };
    };

    const targetNameA = a.others.targetName || "";
    const targetNameB = b.others.targetName || "";

    const priorityA = getPriority(targetNameA);
    const priorityB = getPriority(targetNameB);

    if (priorityA.priority < priorityB.priority) {
      return -1;
    }
    if (priorityA.priority > priorityB.priority) {
      return 1;
    }
    if (priorityA.number < priorityB.number) {
      return -1;
    }
    if (priorityA.number > priorityB.number) {
      return 1;
    }

    const shiftA = a.others.shift || 0;
    const shiftB = b.others.shift || 0;

    if (shiftA < shiftB) {
      return -1;
    }
    if (shiftA > shiftB) {
      return 1;
    }

    return 0;
  };

  return dailyMenus.sort((a, b) => {
    const nameA = customers.get(a.customerId)?.name || "";
    const nameB = customers.get(b.customerId)?.name || "";

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    return compareTargetName(a, b);
  });
}
