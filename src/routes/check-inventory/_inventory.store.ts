import {
  getAllInventories,
  Inventory,
  updateInventory,
} from "@/services/domain";
import useMaterialStore from "@/stores/material.store";
import {
  convertAmountBackward,
  convertAmountForward,
  createStore,
} from "@/utils";

type State = {
  updated: boolean;
  cateringId?: string;
  currents: Record<string, Inventory>;
  updates: Record<string, Inventory>;
  key: number;
  isAuditedAllItems: boolean;
  selectedItemsCount: number;
};

enum ActionType {
  RESET = "RESET",
  SET_INVENTORY = "SET_INVENTORY",
  SET_AMOUNT = "SET_AMOUNT",
  SET_IS_AUDITED = "SET_IS_AUDITED",
  SET_MEMO = "SET_MEMO",
  SET_AUDITED_ALL_ITEMS = "SET_AUDITED_ALL_ITEMS",
}

type Action = {
  type: ActionType;
  cateringId?: string;
  inventories?: Inventory[];
  amount?: number;
  materialId?: string;
  isAudited?: boolean;
  memo?: string;
};

const defaultState: State = {
  updated: false,
  currents: {},
  updates: {},
  key: Date.now(),
  isAuditedAllItems: false,
  selectedItemsCount: 0,
};

const { dispatch, ...store } = createStore<State, Action>(reducer, {
  ...defaultState,
});

export default {
  ...store,
  async setCateringId(cateringId: string) {
    const inventories = await getAllInventories(cateringId);
    dispatch({
      type: ActionType.SET_INVENTORY,
      cateringId,
      inventories,
    });
  },
  reset() {
    dispatch({ type: ActionType.RESET });
  },
  getSystemAmount(materialId: string) {
    return store.getSnapshot().currents[materialId]?.amount || 0;
  },
  getAmount(materialId: string) {
    const state = store.getSnapshot();
    return state.updates[materialId] !== undefined
      ? state.updates[materialId]?.amount
      : state.currents[materialId]?.amount;
  },
  getAmountAfterAudit(materialId: string) {
    return (
      store.getSnapshot().currents[materialId]?.others
        .amountAfterAudit || 0
    );
  },
  getAmountShippedAfterAudit(materialId: string) {
    return (
      store.getSnapshot().currents[materialId]?.others
        .amountShippedAfterAudit || 0
    );
  },
  getAmountReceivedAfterAudit(materialId: string) {
    return (
      store.getSnapshot().currents[materialId]?.others
        .amountReceivedAfterAudit || 0
    );
  },
  getMemo(materialId: string) {
    return (
      store.getSnapshot().currents[materialId]?.others.memo || ""
    );
  },
  getDifference(materialId: string) {
    const state = store.getSnapshot();
    return state.updates[materialId] !== undefined
      ? state.currents[materialId]?.amount -
          state.updates[materialId]?.amount
      : 0;
  },
  getIsAudited(materialId: string) {
    const state = store.getSnapshot();
    return (
      state.currents[materialId]?.others.isAudited ||
      state.updates[materialId]?.others.isAudited ||
      false
    );
  },
  setAmount(materialId: string, amount: number) {
    dispatch({ type: ActionType.SET_AMOUNT, materialId, amount });
  },
  setMemo(materialId: string, memo: string) {
    dispatch({ type: ActionType.SET_MEMO, materialId, memo });
  },
  setIsAudited(materialId: string, isAudited: boolean) {
    dispatch({
      type: ActionType.SET_IS_AUDITED,
      materialId,
      isAudited,
    });
  },
  setAuditedAllItems(isAudited: boolean) {
    dispatch({
      type: ActionType.SET_AUDITED_ALL_ITEMS,
      isAudited,
    });
  },
  async save() {
    const { materials } = useMaterialStore.getState();
    await updateInventory(
      Object.values(store.getSnapshot().updates).map((e) => {
        const material = materials.get(e.materialId);
        const isAudited = e.others.isAudited || false;
        return {
          ...e,
          amount: convertAmountForward({
            material,
            amount: e.amount,
          }),
          others: {
            ...e.others,
            amountAfterAudit: convertAmountForward({
              material,
              amount: isAudited ? 0 : e.others.amountAfterAudit,
            }),
            amountShippedAfterAudit: convertAmountForward({
              material,
              amount: isAudited
                ? 0
                : e.others.amountShippedAfterAudit,
            }),
            amountReceivedAfterAudit: convertAmountForward({
              material,
              amount: isAudited
                ? 0
                : e.others.amountReceivedAfterAudit,
            }),
          },
        };
      }),
    );
  },
};

function reducer(action: Action, state: State): State {
  const { materials } = useMaterialStore.getState();
  let updates: Record<string, Inventory> = {};
  switch (action.type) {
    case ActionType.RESET:
      return { ...defaultState };
    case ActionType.SET_INVENTORY:
      if (action.cateringId && action.inventories) {
        return {
          ...state,
          cateringId: action.cateringId,
          currents: Object.fromEntries(
            action.inventories.map((inventory) => {
              const material = materials.get(inventory.materialId);
              return [
                inventory.materialId,
                {
                  ...inventory,
                  amount: convertAmountBackward({
                    material,
                    amount: inventory.amount,
                  }),
                  others: {
                    ...inventory.others,
                    amountAfterAudit: convertAmountBackward({
                      material,
                      amount: inventory.others.amountAfterAudit,
                    }),
                    amountShippedAfterAudit: convertAmountBackward({
                      material,
                      amount:
                        inventory.others.amountShippedAfterAudit,
                    }),
                    amountReceivedAfterAudit: convertAmountBackward({
                      material,
                      amount:
                        inventory.others.amountReceivedAfterAudit,
                    }),
                  },
                },
              ];
            }),
          ),
          key: Date.now(),
        };
      }
      break;
    case ActionType.SET_AMOUNT:
      if (state.cateringId && action.amount && action.materialId) {
        if (state.updates[action.materialId]) {
          updates = {
            ...state.updates,
            [action.materialId]: {
              ...state.updates[action.materialId],
              amount: action.amount || 0,
            },
          };
        }
        if (state.currents[action.materialId]) {
          updates = {
            ...state.updates,
            [action.materialId]: {
              ...state.currents[action.materialId],
              amount: action.amount || 0,
            },
          };
        }
        return {
          ...state,
          updates,
          updated: true,
          key: Date.now(),
        };
      }
      break;
    case ActionType.SET_IS_AUDITED:
      if (action.materialId && action.isAudited !== undefined) {
        if (state.updates[action.materialId]) {
          updates = {
            ...state.updates,
            [action.materialId]: {
              ...state.updates[action.materialId],
              others: {
                ...state.updates[action.materialId].others,
                isAudited: action.isAudited,
              },
            },
          };
        }
        if (state.currents[action.materialId]) {
          updates = {
            ...state.updates,
            [action.materialId]: {
              ...state.currents[action.materialId],
              others: {
                ...state.currents[action.materialId].others,
                isAudited: action.isAudited,
              },
            },
          };
        }
        const selectedItemsCount = action.isAudited
          ? state.selectedItemsCount + 1
          : state.selectedItemsCount - 1;
        return {
          ...state,
          updates,
          updated: true,
          selectedItemsCount,
          isAuditedAllItems:
            selectedItemsCount === Object.keys(state.currents).length,
          key: Date.now(),
        };
      }
      break;
    case ActionType.SET_MEMO:
      if (action.materialId && action.memo) {
        if (state.updates[action.materialId]) {
          updates = {
            ...state.updates,
            [action.materialId]: {
              ...state.updates[action.materialId],
              others: {
                ...state.updates[action.materialId].others,
                memo: action.memo,
              },
            },
          };
        }
        if (state.currents[action.materialId]) {
          updates = {
            ...state.updates,
            [action.materialId]: {
              ...state.currents[action.materialId],
              others: {
                ...state.currents[action.materialId].others,
                memo: action.memo,
              },
            },
          };
        }
        return { ...state, updates, updated: true };
      }
      break;
    case ActionType.SET_AUDITED_ALL_ITEMS:
      if (action.isAudited !== undefined) {
        let updates = { ...state.updates };
        Object.keys(state.currents).forEach((materialId) => {
          if (state.updates[materialId]) {
            updates = {
              ...updates,
              [materialId]: {
                ...state.updates[materialId],
                others: {
                  ...state.updates[materialId].others,
                  isAudited: action.isAudited || false,
                },
              },
            };
          }
          if (state.currents[materialId]) {
            updates = {
              ...updates,
              [materialId]: {
                ...state.currents[materialId],
                others: {
                  ...state.currents[materialId].others,
                  isAudited: action.isAudited || false,
                },
              },
            };
          }
        });
        return {
          ...state,
          updates,
          updated: true,
          key: Date.now(),
          isAuditedAllItems: action.isAudited,
          selectedItemsCount: action.isAudited
            ? Object.keys(state.currents).length
            : 0,
        };
      }
      break;
  }
  return state;
}
