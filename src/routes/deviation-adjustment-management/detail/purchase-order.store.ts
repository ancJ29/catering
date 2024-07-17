import { poStatusSchema } from "@/auto-generated/api-configs";
import {
  getPurchaseOrderById,
  PurchaseOrder,
  PurchaseOrderDetail,
  updatePurchaseOrder,
  updatePurchaseOrderStatus,
} from "@/services/domain";
import { cloneDeep, createStore } from "@/utils";
import { OrderDetail } from "./_config";

type State = {
  currents: Record<string, OrderDetail>;
  updates: Record<string, OrderDetail>;
  materialIds: string[];
  purchaseOrder?: PurchaseOrder;
  disabled: boolean;
};

enum ActionType {
  INIT_DATA = "INIT_DATA",
  SET_PAYMENT_AMOUNT = "SET_PAYMENT_AMOUNT",
  SET_PRICE = "SET_PRICE",
}

type Action = {
  type: ActionType;
  purchaseOrder?: PurchaseOrder;
  amount?: number;
  materialId?: string;
};

const defaultState = {
  currents: {},
  updates: {},
  materialIds: [],
  disabled: false,
};

const { dispatch, ...store } = createStore<State, Action>(reducer, {
  ...defaultState,
});

export default {
  ...store,
  async initData(purchaseOrderId: string) {
    const purchaseOrder = await getPurchaseOrderById(purchaseOrderId);
    dispatch({ type: ActionType.INIT_DATA, purchaseOrder });
  },
  setPaymentAmount(materialId: string, amount: number) {
    dispatch({
      type: ActionType.SET_PAYMENT_AMOUNT,
      materialId,
      amount,
    });
  },
  setPrice(materialId: string, price: number) {
    dispatch({
      type: ActionType.SET_PRICE,
      materialId,
      amount: price,
    });
  },
  getTotalAmount() {
    const state = store.getSnapshot();
    const total = state.materialIds.reduce((sum, materialId) => {
      const price = state.updates[materialId].price;
      const amount = state.updates[materialId].paymentAmount;
      return sum + price * amount;
    }, 0);
    return total;
  },
  getTaxAmount() {
    const state = store.getSnapshot();
    const total = state.materialIds.reduce((sum, materialId) => {
      const price = state.updates[materialId].price;
      const amount = state.updates[materialId].paymentAmount;
      const tax = state.updates[materialId].vat;
      return sum + price * amount * (tax / 100);
    }, 0);
    return total;
  },
  async save() {
    const state = store.getSnapshot();
    if (!state.purchaseOrder) {
      return;
    }
    await updatePurchaseOrder({
      ...state.purchaseOrder,
      prCode: state.purchaseOrder.others.prCode,
      type: state.purchaseOrder.others.type,
      priority: state.purchaseOrder.others.priority,
      receivingCateringId:
        state.purchaseOrder.others.receivingCateringId,
      status: state.purchaseOrder.others.status,
      purchaseOrderDetails: Object.values(state.updates),
    });
    await updatePurchaseOrderStatus({
      id: state.purchaseOrder.id,
      status: poStatusSchema.Values.DKTSL,
    });
  },
};

function reducer(action: Action, state: State): State {
  switch (action.type) {
    case ActionType.INIT_DATA:
      if (action.purchaseOrder) {
        const currents = initOrderDetails(
          action.purchaseOrder.purchaseOrderDetails,
        );
        return {
          ...state,
          purchaseOrder: action.purchaseOrder,
          currents,
          updates: cloneDeep(currents),
          materialIds: Object.keys(currents),
          disabled:
            action.purchaseOrder.others.status !==
            poStatusSchema.Values.DNK,
        };
      }
      break;
    case ActionType.SET_PAYMENT_AMOUNT:
      if (action.materialId && action.amount) {
        state.updates[action.materialId].paymentAmount =
          action.amount;
        return { ...state };
      }
      break;
    case ActionType.SET_PRICE:
      if (action.materialId && action.amount) {
        state.updates[action.materialId].price = action.amount;
        return { ...state };
      }
      break;
  }
  return state;
}

function initOrderDetails(
  purchaseOrderDetails: PurchaseOrderDetail[],
) {
  const currents: Record<string, OrderDetail> = {};
  purchaseOrderDetails?.forEach((purchaseOrderDetail) => {
    currents[purchaseOrderDetail.materialId] = {
      ...purchaseOrderDetail,
      paymentAmount: purchaseOrderDetail.paymentAmount,
      price: purchaseOrderDetail.others.price,
      vat: purchaseOrderDetail.others.vat,
      supplierNote: purchaseOrderDetail.others.supplierNote || "",
      internalNote: purchaseOrderDetail.others.internalNote || "",
    };
  });
  return currents;
}
