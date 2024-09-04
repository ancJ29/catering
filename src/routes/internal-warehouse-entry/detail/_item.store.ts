import {
  PICateringStatus,
  piCateringStatusSchema,
  piStatusSchema,
} from "@/auto-generated/api-configs";
import {
  addToInventory,
  getPICateringStatus,
  getPurchaseInternalById,
  Material,
  PurchaseInternal,
  PurchaseInternalCatering,
  PurchaseInternalDetail,
  updatePurchaseInternal,
  updatePurchaseInternalStatus,
} from "@/services/domain";
import logger from "@/services/logger";
import useMaterialStore from "@/stores/material.store";
import {
  cloneDeep,
  convertAmountBackward,
  convertAmountForward,
  createStore,
} from "@/utils";
import { InternalDetail } from "./_configs";

type State = {
  purchaseInternal?: PurchaseInternalCatering;
  currents: Record<string, InternalDetail>;
  updates: Record<string, InternalDetail>;
  disabled: boolean;
  changed: boolean;
  key: number;
};

enum ActionType {
  RESET = "RESET",
  INIT_DATA = "INIT_DATA",
  SET_AMOUNT = "SET_AMOUNT",
  SET_KITCHEN_DELIVERY_NOTE = "SET_KITCHEN_DELIVERY_NOTE",
  SET_PRICE = "SET_PRICE",
  SET_STATUS = "SET_STATUS",
  SET_CHECKED = "SET_CHECKED",
  SET_EXPIRY_DATE = "SET_EXPIRY_DATE",
}

type Action = {
  type: ActionType;
  purchaseInternal?: PurchaseInternal;
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
};

const { dispatch, ...store } = createStore<State, Action>(reducer, {
  ...defaultState,
});

export default {
  ...store,
  async initData(purchaseInternalId: string) {
    const purchaseInternal = await getPurchaseInternalById(
      purchaseInternalId,
    );
    logger.info("initData", purchaseInternal);
    dispatch({ type: ActionType.INIT_DATA, purchaseInternal });
  },
  setActualAmount(materialId: string, amount: number) {
    dispatch({ type: ActionType.SET_AMOUNT, materialId, amount });
  },
  setActualPrice(materialId: string, price: number) {
    dispatch({ type: ActionType.SET_PRICE, materialId, price });
  },
  setKitchenDeliveryNote(materialId: string, note: string) {
    dispatch({
      type: ActionType.SET_KITCHEN_DELIVERY_NOTE,
      materialId,
      note,
    });
  },
  setStatus(status: string) {
    dispatch({ type: ActionType.SET_STATUS, status });
  },
  setIsChecked(materialId: string, isChecked: boolean) {
    dispatch({ type: ActionType.SET_CHECKED, materialId, isChecked });
  },
  setExpiryDate(materialId: string, date?: number) {
    dispatch({ type: ActionType.SET_EXPIRY_DATE, materialId, date });
  },
  isCheckAll() {
    for (const item of Object.values(store.getSnapshot().updates)) {
      if (!item.isChecked) {
        return false;
      }
    }
    return true;
  },
  async save() {
    const state = store.getSnapshot();
    const { materials } = useMaterialStore.getState();
    const purchaseInternal = state.purchaseInternal;
    if (!purchaseInternal) {
      return;
    }
    const _purchaseInternal = setUpPurchaseInternal(
      purchaseInternal,
      state,
      materials,
    );
    const _addToInventory = setUpAddToInventory(
      purchaseInternal,
      state,
      materials,
    );

    Promise.all([
      updatePurchaseInternal(_purchaseInternal, false),
      addToInventory(_addToInventory),
    ]);
    await updatePurchaseInternalStatus({
      id: purchaseInternal.id,
      status: piStatusSchema.Values.DNK,
    });
  },
  async update() {
    const state = store.getSnapshot();
    const { materials } = useMaterialStore.getState();
    const purchaseInternal = state.purchaseInternal;
    if (!purchaseInternal) {
      return;
    }
    const _purchaseInternal = setUpPurchaseInternal(
      purchaseInternal,
      state,
      materials,
    );
    await updatePurchaseInternal(_purchaseInternal, false);
    await updatePurchaseInternalStatus({
      id: purchaseInternal.id,
      status: piStatusSchema.Values.NK1P,
    });
  },
};

function reducer(action: Action, state: State): State {
  const { materials } = useMaterialStore.getState();
  switch (action.type) {
    case ActionType.INIT_DATA:
      if (action.purchaseInternal) {
        const currents = initInternalDetails(
          action.purchaseInternal,
          materials,
        );
        const purchaseInternal = {
          ...action.purchaseInternal,
          others: {
            ...action.purchaseInternal.others,
            status: getPICateringStatus(
              action.purchaseInternal.others.status,
            ),
          },
        };
        return {
          ...state,
          purchaseInternal,
          currents,
          updates: cloneDeep(currents),
          disabled:
            purchaseInternal.others.status ===
            piCateringStatusSchema.Values.PINHT,
          changed: false,
          key: Date.now(),
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
    case ActionType.SET_KITCHEN_DELIVERY_NOTE:
      if (action.materialId && action.note) {
        state.updates[action.materialId] = {
          ...state.updates[action.materialId],
          kitchenDeliveryNote: action.note,
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
        const purchaseInternal = state.purchaseInternal;
        if (purchaseInternal) {
          purchaseInternal.others.status =
            action.status as PICateringStatus;
          return {
            ...state,
            purchaseInternal,
          };
        }
        return {
          ...state,
          changed: true,
        };
      }
      break;
    case ActionType.SET_CHECKED:
      if (action.materialId && action.isChecked !== undefined) {
        state.updates[action.materialId] = {
          ...state.updates[action.materialId],
          isChecked: action.isChecked,
        };
        return {
          ...state,
          changed: true,
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

function initInternalDetails(
  purchaseInternal: PurchaseInternal,
  materials: Map<string, Material>,
) {
  logger.info("purchaseInternal", purchaseInternal);
  return Object.fromEntries(
    purchaseInternal?.purchaseInternalDetails.map((e) => [
      e.materialId,
      initInternalDetail(e, materials),
    ]),
  );
}

function initInternalDetail(
  purchaseInternalDetail: PurchaseInternalDetail,
  materials: Map<string, Material>,
): InternalDetail {
  const material = materials.get(purchaseInternalDetail.materialId);
  const amount = convertAmountBackward({
    material,
    amount: purchaseInternalDetail.amount,
  });
  const actualAmount = convertAmountBackward({
    material,
    amount: purchaseInternalDetail.actualAmount,
  });

  logger.info(purchaseInternalDetail.others.expiryDate);

  return {
    id: purchaseInternalDetail.id,
    materialId: purchaseInternalDetail.materialId,
    amount,
    actualAmount,
    price: 0,
    actualPrice: 0,
    kitchenDeliveryNote:
      purchaseInternalDetail.others.kitchenDeliveryNote || "",
    internalNote: purchaseInternalDetail.others.internalNote || "",
    isChecked: purchaseInternalDetail.others.isChecked || false,
    // expiryDate: purchaseInternalDetail.others.expiryDate.getTime(),
    expiryDate: 0,
  };
}

function setUpPurchaseInternal(
  purchaseInternal: PurchaseInternalCatering,
  state: State,
  materials: Map<string, Material>,
) {
  return {
    ...purchaseInternal,
    others: {
      ...purchaseInternal.others,
      status: piStatusSchema.Values.DNK,
    },
    purchaseInternalDetails: Object.values(state.updates).map(
      (item) => {
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
            kitchenDeliveryNote: item.kitchenDeliveryNote,
            internalNote: item.internalNote,
            price: item.actualPrice,
            expiryDate: new Date(item.expiryDate),
          },
        };
      },
    ),
  };
}

function setUpAddToInventory(
  purchaseInternal: PurchaseInternalCatering,
  state: State,
  materials: Map<string, Material>,
) {
  return Object.values(state.updates).map((item) => ({
    materialId: item.materialId,
    amount: convertAmountForward({
      material: materials.get(item.materialId),
      amount: item.actualAmount,
    }),
    departmentId: purchaseInternal.others.receivingCateringId,
    expiryDate: new Date(item.expiryDate),
  }));
}
