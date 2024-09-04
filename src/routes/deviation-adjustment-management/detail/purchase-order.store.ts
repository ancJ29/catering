import { poStatusSchema } from "@/auto-generated/api-configs";
import {
  getPurchaseOrderById,
  Material,
  PurchaseOrder,
  PurchaseOrderDetail,
  updatePurchaseOrder,
  updatePurchaseOrderStatus,
} from "@/services/domain";
import useMaterialStore from "@/stores/material.store";
import {
  cloneDeep,
  convertAmountBackward,
  convertAmountForward,
  createStore,
} from "@/utils";
import { NavigateFunction } from "react-router-dom";
import { OrderDetail } from "./_configs";

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
  async initData(purchaseOrderId: string, navigate: NavigateFunction) {
    const purchaseOrder = await getPurchaseOrderById(purchaseOrderId);
    if (!purchaseOrder) {
      navigate("/");
    }
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
    const { materials } = useMaterialStore.getState();
    await updatePurchaseOrder({
      ...state.purchaseOrder,
      purchaseOrderDetails: Object.values(state.updates).map((e) => {
        const material = materials.get(e.materialId);
        const amount = convertAmountForward({
          material,
          amount: e.amount,
        });
        const actualAmount = convertAmountForward({
          material,
          amount: e.actualAmount,
        });
        const paymentAmount = convertAmountForward({
          material,
          amount: e.paymentAmount,
        });
        return {
          ...e,
          amount,
          actualAmount,
          paymentAmount,
          others: {
            isChecked: e.isChecked,
            supplierNote: e.supplierNote || "",
            internalNote: e.internalNote || "",
            price: e.price || 0,
            vat: e.vat || 0,
            expiryDate: e.expiryDate,
          },
        };
      }),
    });
    await updatePurchaseOrderStatus({
      id: state.purchaseOrder.id,
      status: poStatusSchema.Values.DKTSL,
    });
  },
};

function reducer(action: Action, state: State): State {
  const { materials } = useMaterialStore.getState();
  switch (action.type) {
    case ActionType.INIT_DATA:
      if (action.purchaseOrder) {
        const currents = initOrderDetails(
          action.purchaseOrder.purchaseOrderDetails,
          materials,
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
  materials: Map<string, Material>,
) {
  const currents: Record<string, OrderDetail> = {};
  purchaseOrderDetails?.forEach((purchaseOrderDetail) => {
    const material = materials.get(purchaseOrderDetail.materialId);
    const amount = convertAmountBackward({
      material,
      amount: purchaseOrderDetail.amount,
    });
    const actualAmount = convertAmountBackward({
      material,
      amount: purchaseOrderDetail.actualAmount,
    });
    const paymentAmount = convertAmountBackward({
      material,
      amount: purchaseOrderDetail.paymentAmount,
    });

    currents[purchaseOrderDetail.materialId] = {
      ...purchaseOrderDetail,
      amount: amount,
      actualAmount: actualAmount,
      paymentAmount: paymentAmount,
      price: purchaseOrderDetail.others.price,
      vat: purchaseOrderDetail.others.vat,
      supplierNote: purchaseOrderDetail.others.supplierNote || "",
      internalNote: purchaseOrderDetail.others.internalNote || "",
      isChecked: purchaseOrderDetail.others.isChecked || false,
      expiryDate: purchaseOrderDetail.others.expiryDate,
    };
  });
  return currents;
}
