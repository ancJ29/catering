import {
  pcStatusSchema,
  PRPriority,
  PRType,
} from "@/auto-generated/api-configs";
import {
  AddPurchaseOrderRequest,
  addPurchaseOrders,
  getPurchaseCoordinationById,
  Material,
  PurchaseCoordination,
  PurchaseCoordinationDetail,
  SupplierMaterial,
  updatePurchaseCoordination,
} from "@/services/domain";
import useMaterialStore from "@/stores/material.store";
import {
  cloneDeep,
  convertAmountBackward,
  convertAmountForward,
  createStore,
} from "@/utils";
import {
  CoordinationDetail,
  SupplierSelectItemData,
} from "./_configs";

type State = {
  purchaseCoordination?: PurchaseCoordination;
  currents: Record<string, CoordinationDetail>;
  updates: Record<string, CoordinationDetail>;
  materialIds: string[];
  supplierMaterials: SupplierMaterialsByMaterial;
};

enum ActionType {
  RESET = "RESET",
  INIT_DATA = "INIT_DATA",
  SET_QUANTITY = "SET_QUANTITY",
  SET_SUPPLIER_NOTE = "SET_SUPPLIER_NOTE",
  SET_INTERNAL_NOTE = "SET_INTERNAL_NOTE",
  ADD_MATERIAL = "ADD_MATERIAL",
  REMOVE_MATERIAL = "REMOVE_MATERIAL",
  SET_SUPPLIER_ID = "SET_SUPPLIER_ID",
}

type Action = {
  type: ActionType;
  purchaseCoordination?: PurchaseCoordination;
  quantity?: number;
  note?: string;
  materialId?: string;
  supplierId?: string;
};

const defaultState = {
  currents: {},
  updates: {},
  materialIds: [],
  supplierMaterials: {},
};

const { dispatch, ...store } = createStore<State, Action>(reducer, {
  ...defaultState,
});

export default {
  ...store,
  async initData(purchaseCoordinationId: string) {
    const purchaseCoordination = await getPurchaseCoordinationById(
      purchaseCoordinationId,
    );
    if (!purchaseCoordination) {
      return;
    }
    dispatch({
      type: ActionType.INIT_DATA,
      purchaseCoordination,
    });
  },
  getPurchaseCoordination() {
    return store.getSnapshot().purchaseCoordination;
  },
  getPrice(materialId: string) {
    const state = store.getSnapshot();
    const supplierId = state.currents[materialId].supplierId || "";
    return (
      state.supplierMaterials[materialId][supplierId]?.price || 0
    );
  },
  getTotalMaterial() {
    return Object.keys(store.getSnapshot().currents).length;
  },
  getTotalPrice() {
    const state = store.getSnapshot();
    const total = state.materialIds.reduce((sum, materialId) => {
      const supplierId = state.currents[materialId].supplierId || "";
      const price =
        state.supplierMaterials[materialId][supplierId]?.price || 0;
      const amount = state.updates[materialId].orderQuantity;
      return sum + price * amount;
    }, 0);
    return total;
  },
  setQuantity(materialId: string, quantity: number) {
    dispatch({
      type: ActionType.SET_QUANTITY,
      materialId,
      quantity,
    });
  },
  setSupplierNote(materialId: string, note: string) {
    dispatch({
      type: ActionType.SET_SUPPLIER_NOTE,
      materialId,
      note,
    });
  },
  setInternalNote(materialId: string, note: string) {
    dispatch({
      type: ActionType.SET_INTERNAL_NOTE,
      materialId,
      note,
    });
  },
  addMaterial(materialId: string) {
    dispatch({
      type: ActionType.ADD_MATERIAL,
      materialId,
    });
  },
  removeMaterial(materialId: string) {
    dispatch({
      type: ActionType.REMOVE_MATERIAL,
      materialId,
    });
  },
  getSupplierData(materialId: string): SupplierSelectItemData[] {
    const { materials } = useMaterialStore.getState();
    const state = store.getSnapshot();
    const supplierMaterials = Object.values(
      state.supplierMaterials[materialId],
    );
    return initSupplierData(
      materialId,
      supplierMaterials,
      materials,
      state.purchaseCoordination?.others.receivingCateringId || "",
    );
  },
  setSupplierId(materialId: string, supplierId: string) {
    dispatch({
      type: ActionType.SET_SUPPLIER_ID,
      materialId,
      supplierId,
    });
  },
  async complete() {
    const { materials } = useMaterialStore.getState();
    const state = store.getSnapshot();
    if (!state.purchaseCoordination) {
      return;
    }
    const grouped: { [key: string]: CoordinationDetail[] } = {};
    const purchaseOrder: AddPurchaseOrderRequest = [];
    for (const key of Object.keys(state.updates)) {
      if (key === null) {
        return false;
      }
      const detail = state.updates[key];
      const supplierId = detail.supplierId;
      if (!supplierId) {
        return false;
      }
      if (!grouped[supplierId]) {
        grouped[supplierId] = [];
      }
      grouped[supplierId].push(detail);
    }
    Object.keys(grouped).map((key) => {
      const coordinationDetails = grouped[key];
      purchaseOrder.push({
        deliveryDate:
          state.purchaseCoordination?.deliveryDate || new Date(),
        purchaseCoordinationId: state.purchaseCoordination?.id || "",
        supplierId: key,
        others: {
          receivingCateringId:
            state.purchaseCoordination?.others.receivingCateringId ||
            "",
          prCode: state.purchaseCoordination?.others.prCode || "",
          type: state.purchaseCoordination?.others.type as PRType,
          priority: state.purchaseCoordination?.others
            .priority as PRPriority,
        },
        purchaseOrderDetails: coordinationDetails.map((cd) => ({
          amount: convertAmountForward({
            material: materials.get(cd.materialId),
            amount: cd.orderQuantity,
          }),
          materialId: cd.materialId,
          others: {
            price: cd.price,
            supplierNote: cd.supplierNote,
            internalNote: cd.internalNote,
            vat: 0,
          },
        })),
      });
    });
    await Promise.all([
      updatePurchaseCoordination({
        ...state.purchaseCoordination,
        others: {
          ...state.purchaseCoordination?.others,
          // cspell:disable
          status: pcStatusSchema.Values.CNCCPH,
          // cspell:enable
        },
        purchaseCoordinationDetails: Object.values(state.updates).map(
          (e) => ({
            id: e.id,
            materialId: e.materialId,
            amount: convertAmountForward({
              material: materials.get(e.materialId),
              amount: e.orderQuantity,
            }),
            others: {
              price: e.price,
              supplierNote: e.supplierNote,
              internalNote: e.internalNote,
            },
          }),
        ),
      }),
      addPurchaseOrders(purchaseOrder),
    ]);
    return true;
  },
};

function reducer(action: Action, state: State): State {
  const { materials } = useMaterialStore.getState();
  switch (action.type) {
    case ActionType.RESET:
      return {
        ...defaultState,
      };
    case ActionType.INIT_DATA:
      if (action.purchaseCoordination) {
        const currents = initCoordinationDetails(
          action.purchaseCoordination,
          materials,
        );
        const supplierMaterials = initSupplierMaterial(materials);
        return {
          ...state,
          purchaseCoordination: action.purchaseCoordination,
          currents,
          updates: cloneDeep(currents),
          materialIds: Object.keys(currents),
          supplierMaterials,
        };
      }
      break;
    case ActionType.SET_QUANTITY:
      if (action.materialId && action.quantity) {
        state.updates[action.materialId] = {
          ...state.updates[action.materialId],
          orderQuantity: action.quantity,
        };
        return {
          ...state,
        };
      }
      break;
    case ActionType.SET_SUPPLIER_NOTE:
      if (action.materialId && action.note) {
        state.updates[action.materialId] = {
          ...state.updates[action.materialId],
          supplierNote: action.note,
        };
      }
      break;
    case ActionType.SET_INTERNAL_NOTE:
      if (action.materialId && action.note) {
        state.updates[action.materialId] = {
          ...state.updates[action.materialId],
          internalNote: action.note,
        };
      }
      break;
    case ActionType.ADD_MATERIAL:
      if (
        action.materialId &&
        !(action.materialId in state.currents)
      ) {
        const purchaseCoordinationDetail: PurchaseCoordinationDetail =
          {
            id: "",
            others: {
              price: 0,
              supplierNote: "",
              internalNote: "",
            },
            materialId: action.materialId,
            amount: 0,
            purchaseCoordinationId:
              state.purchaseCoordination?.id || "",
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        state.currents[action.materialId] = initCoordinationDetail(
          purchaseCoordinationDetail,
          materials,
          state.purchaseCoordination?.others.receivingCateringId ||
            "",
        );
        state.updates[action.materialId] =
          state.currents[action.materialId];
        return {
          ...state,
          materialIds: [...state.materialIds, action.materialId],
        };
      }
      break;
    case ActionType.REMOVE_MATERIAL:
      if (action.materialId && action.materialId in state.currents) {
        delete state.currents[action.materialId];
        delete state.updates[action.materialId];
        return {
          ...state,
          updates: { ...state.updates },
          materialIds: state.materialIds.filter(
            (id) => id !== action.materialId,
          ),
        };
      }
      break;
    case ActionType.SET_SUPPLIER_ID:
      if (action.materialId && action.supplierId) {
        state.currents[action.materialId].supplierId =
          action.supplierId;
        state.updates[action.materialId] =
          state.currents[action.materialId];
        return {
          ...state,
        };
      }
      break;
  }
  return state;
}

function initCoordinationDetails(
  purchaseCoordination: PurchaseCoordination,
  materials: Map<string, Material>,
) {
  return Object.fromEntries(
    purchaseCoordination?.purchaseCoordinationDetails.map((e) => [
      e.materialId,
      initCoordinationDetail(
        e,
        materials,
        purchaseCoordination.others.receivingCateringId,
      ),
    ]),
  );
}

function initCoordinationDetail(
  purchaseCoordinationDetail: PurchaseCoordinationDetail,
  materials: Map<string, Material>,
  cateringId: string,
): CoordinationDetail {
  const material = materials.get(
    purchaseCoordinationDetail.materialId,
  );
  const amount = convertAmountBackward({
    material,
    amount: purchaseCoordinationDetail.amount,
  });
  return {
    id: purchaseCoordinationDetail.id,
    materialId: purchaseCoordinationDetail.materialId,
    approvedQuantity: amount,
    orderQuantity: amount,
    supplierId:
      material?.others.prices?.[cateringId]?.supplierId || "",
    price: material?.others.prices?.[cateringId]?.price || 0,
    supplierNote:
      purchaseCoordinationDetail.others.supplierNote || "",
    internalNote:
      purchaseCoordinationDetail.others.internalNote || "",
  };
}

type SupplierMaterialsByMaterial = Record<
string,
Record<string, SupplierMaterial>
>;

function initSupplierMaterial(
  materials: Map<string, Material>,
): SupplierMaterialsByMaterial {
  return Array.from(materials.values()).reduce((acc, material) => {
    const materialKey = material.id;
    if (!acc[materialKey]) {
      acc[materialKey] = {};
    }

    material.supplierMaterials.forEach((supplierMaterial) => {
      const supplierId = supplierMaterial.supplier.id;
      acc[materialKey][supplierId] = supplierMaterial;
    });

    return acc;
  }, {} as SupplierMaterialsByMaterial);
}

function initSupplierData(
  materialId: string,
  supplierMaterials: SupplierMaterial[],
  materials: Map<string, Material>,
  cateringId: string,
) {
  const material = materials.get(materialId);
  const preferredSupplierId =
    material?.others.prices?.[cateringId || ""]?.supplierId || "";
  const items = supplierMaterials.map((sm) => ({
    supplierId: sm.supplier.id,
    supplierName: sm.supplier.name,
    unitName: material?.others.unit?.name || "",
    price: sm.price || 0,
  }));
  const matchedItem = items.find(
    (item) => item.supplierId === preferredSupplierId,
  );
  const otherItems = items.filter(
    (item) => item.supplierId !== preferredSupplierId,
  );

  if (matchedItem) {
    return [matchedItem, ...otherItems];
  } else {
    return items;
  }
}
