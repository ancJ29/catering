import {
  PIStatus,
  piStatusSchema,
} from "@/auto-generated/api-configs";
import {
  getPurchaseInternalById,
  Material,
  PurchaseInternal,
  PurchaseInternalDetail,
} from "@/services/domain";
import useMaterialStore from "@/stores/material.store";
import {
  cloneDeep,
  convertAmountBackward,
  createStore,
} from "@/utils";
import { InternalDetail } from "./_configs";

type State = {
  purchaseInternal?: PurchaseInternal;
  currents: Record<string, InternalDetail>;
  updates: Record<string, InternalDetail>;
  disabled: boolean;
};

enum ActionType {
  RESET = "RESET",
  INIT_DATA = "INIT_DATA",
  SET_AMOUNT = "SET_AMOUNT",
  SET_KITCHEN_DELIVERY_NOTE = "SET_KITCHEN_DELIVERY_NOTE",
  SET_PRICE = "SET_PRICE",
  SET_STATUS = "SET_STATUS",
}

type Action = {
  type: ActionType;
  purchaseInternal?: PurchaseInternal;
  materialId?: string;
  amount?: number;
  note?: string;
  price?: number;
  status?: string;
};

const defaultState = {
  currents: {},
  updates: {},
  disabled: true,
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
  async save() {
    const state = store.getSnapshot();
    const purchaseInternal = state.purchaseInternal;
    if (!purchaseInternal) {
      return;
    }

    // const _purchaseInternal = {
    //   ...purchaseInternal,
    //   others: {
    //     ...purchaseInternal.others,
    //     status: piStatusSchema.Values.DNK,
    //   },
    //   purchaseInternalDetails: Object.values(state.updates).map(
    //     (item) => {
    //       const amount = convertAmountForward({
    //         material: materials.get(item.materialId),
    //         amount: item.amount,
    //       });
    //       const actualAmount = convertAmountForward({
    //         material: materials.get(item.materialId),
    //         amount: item.actualAmount,
    //       });
    //       return {
    //         id: item.id,
    //         materialId: item.materialId,
    //         amount,
    //         actualAmount,
    //         paymentAmount: actualAmount,
    //         others: {
    //           kitchenDeliveryNote: item.kitchenDeliveryNote,
    //           internalNote: item.internalNote,
    //           price: item.actualPrice,
    //         },
    //       };
    //     },
    //   ),
    // };

    // const _warehouseReceipt = {
    //   date: purchaseInternal.deliveryDate,
    //   departmentId: purchaseInternal.others.receivingCateringId,
    //   others: {
    //     type: wrTypeSchema.Values.NDCK,
    //     cateringId: purchaseInternal.others.receivingCateringId,
    //   },
    //   warehouseReceiptDetails: Object.values(state.updates).map(
    //     (item) => ({
    //       materialId: item.materialId,
    //       amount: convertAmountForward({
    //         material: materials.get(item.materialId),
    //         amount: item.actualAmount,
    //       }),
    //       price: item.actualPrice,
    //       others: {
    //         memo: item.kitchenDeliveryNote,
    //       },
    //     }),
    //   ),
    // };

    // const _addToInventory = Object.values(state.updates).map(
    //   (item) => ({
    //     materialId: item.materialId,
    //     amount: convertAmountForward({
    //       material: materials.get(item.materialId),
    //       amount: item.actualAmount,
    //     }),
    //     departmentId: purchaseInternal.others.receivingCateringId,
    //   }),
    // );

    // Promise.all([
    //   updatePurchaseInternal(_purchaseInternal),
    //   addWarehouseReceipt(_warehouseReceipt),
    //   addToInventory(_addToInventory),
    // ]);
    // await updatePurchaseInternalStatus({
    //   id: purchaseInternal.id,
    //   status: piStatusSchema.Values.DNK,
    // });
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
        return {
          ...state,
          purchaseInternal: action.purchaseInternal,
          currents,
          updates: cloneDeep(currents),
          disabled:
            action.purchaseInternal.others.status ===
              piStatusSchema.Values.NK1P ||
            action.purchaseInternal.others.status ===
              piStatusSchema.Values.DNK,
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
        };
      }
      break;
    case ActionType.SET_KITCHEN_DELIVERY_NOTE:
      if (action.materialId && action.note) {
        state.updates[action.materialId] = {
          ...state.updates[action.materialId],
          kitchenDeliveryNote: action.note,
        };
      }
      break;
    case ActionType.SET_PRICE:
      if (action.materialId && action.price) {
        state.updates[action.materialId] = {
          ...state.updates[action.materialId],
          actualPrice: action.price,
        };
      }
      break;
    case ActionType.SET_STATUS:
      if (action.status) {
        const purchaseInternal = state.purchaseInternal;
        if (purchaseInternal) {
          purchaseInternal.others.status = action.status as PIStatus;
          return {
            ...state,
            purchaseInternal,
          };
        }
      }
      break;
  }
  return state;
}

function initInternalDetails(
  purchaseInternal: PurchaseInternal,
  materials: Map<string, Material>,
) {
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
  };
}
