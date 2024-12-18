import {
  POCateringStatus,
  poCateringStatusSchema,
  PODeliveryTimeStatus,
  POServiceStatus,
  poStatusSchema,
  wrTypeSchema,
} from "@/auto-generated/api-configs";
import {
  addToInventory,
  addWarehouseReceipt,
  getPOCateringStatus,
  getPurchaseOrderById,
  Material,
  PurchaseOrder,
  PurchaseOrderCatering,
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
  purchaseOrder?: PurchaseOrderCatering;
  currents: Record<string, OrderDetail>;
  updates: Record<string, OrderDetail>;
  disabled: boolean;
  changed: boolean;
  key: number;
  isCheckAll: boolean;
};

enum ActionType {
  RESET = "RESET",
  INIT_DATA = "INIT_DATA",
  SET_AMOUNT = "SET_AMOUNT",
  SET_SUPPLIER_NOTE = "SET_SUPPLIER_NOTE",
  SET_PRICE = "SET_PRICE",
  SET_STATUS = "SET_STATUS",
  SET_SERVICE_STATUS = "SET_SERVICE_STATUS",
  SET_DELIVERY_TIME_STATUS = "SET_DELIVERY_TIME_STATUS",
  SET_CHECKED = "SET_CHECKED",
  SET_EXPIRY_DATE = "SET_EXPIRY_DATE",
  SET_CHECK_ALL = "SET_CHECK_ALL",
}

type Action = {
  type: ActionType;
  purchaseOrder?: PurchaseOrder;
  materialId?: string;
  amount?: number;
  note?: string;
  price?: number;
  status?: string;
  isChecked?: boolean;
  date?: number;
};

const defaultState = {
  currents: {},
  updates: {},
  disabled: true,
  changed: false,
  key: Date.now(),
  isCheckAll: false,
};

const { dispatch, ...store } = createStore<State, Action>(reducer, {
  ...defaultState,
});

export default {
  ...store,
  async initData(
    purchaseOrderId: string,
    navigate: NavigateFunction,
  ) {
    const purchaseOrder = await getPurchaseOrderById(purchaseOrderId);
    if (!purchaseOrder) {
      navigate("/");
    }
    dispatch({ type: ActionType.INIT_DATA, purchaseOrder });
  },
  setActualAmount(materialId: string, amount: number) {
    dispatch({ type: ActionType.SET_AMOUNT, materialId, amount });
  },
  setActualPrice(materialId: string, price: number) {
    dispatch({ type: ActionType.SET_PRICE, materialId, price });
  },
  setSupplierNote(materialId: string, note: string) {
    dispatch({
      type: ActionType.SET_SUPPLIER_NOTE,
      materialId,
      note,
    });
  },
  setStatus(status: string) {
    dispatch({ type: ActionType.SET_STATUS, status });
  },
  setDeliveryTimeStatus(deliveryTimeStatus: string) {
    dispatch({
      type: ActionType.SET_DELIVERY_TIME_STATUS,
      status: deliveryTimeStatus,
    });
  },
  setServiceStatus(serviceStatus: string) {
    dispatch({
      type: ActionType.SET_SERVICE_STATUS,
      status: serviceStatus,
    });
  },
  isChecked(materialId: string) {
    const state = store.getSnapshot();
    return state.currents[materialId].isChecked;
  },
  setIsChecked(materialId: string, isChecked: boolean) {
    dispatch({ type: ActionType.SET_CHECKED, materialId, isChecked });
  },
  setCheckAll(isCheckAll: boolean) {
    dispatch({
      type: ActionType.SET_CHECK_ALL,
      isChecked: isCheckAll,
    });
  },
  setExpiryDate(materialId: string, date?: number) {
    dispatch({ type: ActionType.SET_EXPIRY_DATE, materialId, date });
  },
  async save() {
    const state = store.getSnapshot();
    const { materials } = useMaterialStore.getState();
    const purchaseOrder = state.purchaseOrder;
    if (!purchaseOrder) {
      return;
    }
    const _purchaseOrder = setUpPurchaseOrder(
      purchaseOrder,
      state,
      materials,
    );
    const _warehouseReceipt = setUpWarehouseReceipt(
      purchaseOrder,
      state,
      materials,
    );
    const _addToInventory = setUpAddToInventory(
      purchaseOrder,
      state,
      materials,
    );
    Promise.all([
      updatePurchaseOrder(_purchaseOrder),
      addWarehouseReceipt(_warehouseReceipt),
      addToInventory(_addToInventory),
    ]);
    await updatePurchaseOrderStatus({
      id: purchaseOrder.id,
      status: poStatusSchema.Values.DNK,
    });
  },
  async update() {
    const state = store.getSnapshot();
    const { materials } = useMaterialStore.getState();
    const purchaseOrder = state.purchaseOrder;
    if (!purchaseOrder) {
      return;
    }
    const _purchaseOrder = setUpPurchaseOrder(
      purchaseOrder,
      state,
      materials,
    );
    await updatePurchaseOrder(_purchaseOrder);
    await updatePurchaseOrderStatus({
      id: purchaseOrder.id,
      status: poStatusSchema.Values.NK1P,
    });
  },
};

function reducer(action: Action, state: State): State {
  const { materials } = useMaterialStore.getState();
  switch (action.type) {
    case ActionType.INIT_DATA:
      if (action.purchaseOrder) {
        const currents = initOrderDetails(
          action.purchaseOrder,
          materials,
        );
        const purchaseOrder = {
          ...action.purchaseOrder,
          others: {
            ...action.purchaseOrder.others,
            status: getPOCateringStatus(
              action.purchaseOrder.others.status,
            ),
          },
        };
        return {
          ...state,
          key: Date.now(),
          purchaseOrder,
          currents,
          updates: cloneDeep(currents),
          disabled:
            purchaseOrder.others.status ===
            poCateringStatusSchema.Values.PONHT,
          changed: false,
          isCheckAll: isCheckAll(currents),
        };
      }
      break;
    case ActionType.SET_AMOUNT:
      if (action.materialId && action.amount) {
        state.updates[action.materialId] = {
          ...state.updates[action.materialId],
          actualAmount: action.amount,
        };
        return {
          ...state,
          changed: true,
        };
      }
      break;
    case ActionType.SET_SUPPLIER_NOTE:
      if (action.materialId && action.note) {
        state.updates[action.materialId] = {
          ...state.updates[action.materialId],
          supplierNote: action.note,
        };
        return {
          ...state,
          changed: true,
        };
      }
      break;
    case ActionType.SET_PRICE:
      if (action.materialId && action.price) {
        state.updates[action.materialId] = {
          ...state.updates[action.materialId],
          actualPrice: action.price,
        };
        return {
          ...state,
          changed: true,
        };
      }
      break;
    case ActionType.SET_STATUS:
      if (action.status) {
        const purchaseOrder = state.purchaseOrder;
        if (purchaseOrder) {
          purchaseOrder.others.status =
            action.status as POCateringStatus;
          return {
            ...state,
            purchaseOrder,
            changed: true,
          };
        }
      }
      break;
    case ActionType.SET_SERVICE_STATUS:
      if (action.status) {
        const purchaseOrder = state.purchaseOrder;
        if (purchaseOrder) {
          purchaseOrder.others.serviceStatus =
            action.status as POServiceStatus;
          return {
            ...state,
            purchaseOrder,
            changed: true,
          };
        }
      }
      break;
    case ActionType.SET_DELIVERY_TIME_STATUS:
      if (action.status) {
        const purchaseOrder = state.purchaseOrder;
        if (purchaseOrder) {
          purchaseOrder.others.deliveryTimeStatus =
            action.status as PODeliveryTimeStatus;
          return {
            ...state,
            purchaseOrder,
            changed: true,
          };
        }
      }
      break;
    case ActionType.SET_CHECKED:
      if (action.materialId && action.isChecked !== undefined) {
        state.currents[action.materialId] = {
          ...state.currents[action.materialId],
          isChecked: action.isChecked,
        };
        return {
          ...state,
          updates: cloneDeep(state.currents),
          changed: true,
          isCheckAll: isCheckAll(state.currents),
        };
      }
      break;
    case ActionType.SET_CHECK_ALL:
      if (action.isChecked !== undefined) {
        Object.keys(state.currents).map((key) => {
          state.currents[key] = {
            ...state.currents[key],
            isChecked: action.isChecked || false,
          };
        });
        return {
          ...state,
          updates: cloneDeep(state.currents),
          changed: true,
          isCheckAll: action.isChecked,
        };
      }
      break;
    case ActionType.SET_EXPIRY_DATE:
      if (action.materialId && action.date) {
        state.updates[action.materialId] = {
          ...state.updates[action.materialId],
          expiryDate: action.date,
        };
      }
      break;
  }
  return state;
}

function initOrderDetails(
  purchaseOrder: PurchaseOrder,
  materials: Map<string, Material>,
) {
  return Object.fromEntries(
    purchaseOrder?.purchaseOrderDetails.map((e) => [
      e.materialId,
      initOrderDetail(e, materials),
    ]),
  );
}

function initOrderDetail(
  purchaseOrderDetail: PurchaseOrderDetail,
  materials: Map<string, Material>,
): OrderDetail {
  const material = materials.get(purchaseOrderDetail.materialId);
  const amount = convertAmountBackward({
    material,
    amount: purchaseOrderDetail.amount,
  });
  const actualAmount = convertAmountBackward({
    material,
    amount: purchaseOrderDetail.actualAmount,
  });
  return {
    id: purchaseOrderDetail.id,
    materialId: purchaseOrderDetail.materialId,
    amount,
    actualAmount,
    price: purchaseOrderDetail.others.price,
    actualPrice: purchaseOrderDetail.others.price,
    supplierNote: purchaseOrderDetail.others.supplierNote || "",
    internalNote: purchaseOrderDetail.others.internalNote || "",
    vat: purchaseOrderDetail.others.vat,
    isChecked: purchaseOrderDetail.others.isChecked,
    expiryDate: purchaseOrderDetail.others.expiryDate.getTime(),
  };
}

function setUpPurchaseOrder(
  purchaseOrder: PurchaseOrderCatering,
  state: State,
  materials: Map<string, Material>,
) {
  return {
    ...purchaseOrder,
    others: {
      ...purchaseOrder.others,
      status: poStatusSchema.Values.DNK,
    },
    purchaseOrderDetails: Object.values(state.updates).map((item) => {
      const amount = convertAmountForward({
        material: materials.get(item.materialId),
        amount: item.amount,
      });
      const actualAmount = convertAmountForward({
        material: materials.get(item.materialId),
        amount: item.actualAmount,
      });
      return {
        id: item.id,
        materialId: item.materialId,
        amount,
        actualAmount,
        paymentAmount: actualAmount,
        others: {
          isChecked: item.isChecked,
          supplierNote: item.supplierNote,
          internalNote: item.internalNote,
          price: item.actualPrice,
          vat: item.vat,
          expiryDate: new Date(item.expiryDate),
        },
      };
    }),
  };
}

function setUpWarehouseReceipt(
  purchaseOrder: PurchaseOrderCatering,
  state: State,
  materials: Map<string, Material>,
) {
  return {
    date: purchaseOrder.deliveryDate,
    departmentId: purchaseOrder.others.receivingCateringId,
    others: {
      type: wrTypeSchema.Values.NTNCC,
      supplierId: purchaseOrder.supplierId,
    },
    warehouseReceiptDetails: Object.values(state.updates).map(
      (item) => ({
        materialId: item.materialId,
        amount: convertAmountForward({
          material: materials.get(item.materialId),
          amount: item.actualAmount,
        }),
        price: item.actualPrice,
        others: {
          memo: item.supplierNote,
        },
      }),
    ),
  };
}

function setUpAddToInventory(
  purchaseOrder: PurchaseOrderCatering,
  state: State,
  materials: Map<string, Material>,
) {
  return Object.values(state.updates).map((item) => ({
    materialId: item.materialId,
    amount: convertAmountForward({
      material: materials.get(item.materialId),
      amount: item.actualAmount,
    }),
    departmentId: purchaseOrder.others.receivingCateringId,
    expiryDate: new Date(item.expiryDate),
  }));
}

function isCheckAll(records: Record<string, OrderDetail>) {
  for (const item of Object.values(records)) {
    if (!item.isChecked) {
      return false;
    }
  }
  return true;
}
