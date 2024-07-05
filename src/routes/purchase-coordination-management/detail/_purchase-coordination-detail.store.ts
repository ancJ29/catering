import {
  AddPurchaseOrderRequest,
  Material,
  PreferredSupplier,
  PurchaseCoordination,
  PurchaseCoordinationDetail,
  SupplierMaterial,
  addPurchaseOrders,
  getPreferredSuppliersByDepartmentId,
  getPurchaseCoordinationById,
  updatePurchaseCoordination,
} from "@/services/domain";
import useMaterialStore from "@/stores/material.store";
import { cloneDeep, createStore } from "@/utils";
import { convertAmount } from "@/utils/unit";
import {
  CoordinationDetail,
  SupplierSelectItemData,
} from "./_config";

type State = {
  purchaseCoordination?: PurchaseCoordination;
  currents: Record<string, CoordinationDetail>;
  updates: Record<string, CoordinationDetail>;
  materialIds: string[];
  supplierMaterials: SupplierMaterialsByMaterial;
  preferredSuppliers: Record<string, PreferredSupplier>;
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
  preferredSuppliers?: PreferredSupplier[];
};

const defaultState = {
  currents: {},
  updates: {},
  materialIds: [],
  supplierMaterials: {},
  preferredSuppliers: {},
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
    const preferredSuppliers =
      await getPreferredSuppliersByDepartmentId(
        purchaseCoordination.others.receivingCateringId,
      );
    dispatch({
      type: ActionType.INIT_DATA,
      purchaseCoordination,
      preferredSuppliers,
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
    const preferredSupplierId =
      state.preferredSuppliers[materialId]?.supplierId;
    return initSupplierData(
      materialId,
      supplierMaterials,
      materials,
      preferredSupplierId,
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
    const state = store.getSnapshot();
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
        receivingCateringId:
          state.purchaseCoordination?.others.receivingCateringId ||
          "",
        prCode: state.purchaseCoordination?.others.prCode || "",
        type: state.purchaseCoordination?.others.type || "",
        priority: state.purchaseCoordination?.others.priority || "",
        supplierId: key,
        purchaseOrderDetails: coordinationDetails.map((cd) => ({
          price: cd.price,
          amount: cd.orderQuantity,
          materialId: cd.materialId,
          supplierNote: cd.supplierNote,
          internalNote: cd.internalNote,
        })),
      });
    });
    await Promise.all([
      updatePurchaseCoordination(
        "CNCCPH",
        state.purchaseCoordination,
      ),
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
      if (
        action.purchaseCoordination &&
        action.preferredSuppliers !== undefined
      ) {
        const preferredSuppliers = Object.fromEntries(
          action.preferredSuppliers.map((e) => [e.materialId, e]),
        );
        const currents = initCoordinationDetails(
          action.purchaseCoordination,
          materials,
          preferredSuppliers,
        );
        const supplierMaterials = initSupplierMaterial(materials);
        return {
          ...state,
          purchaseCoordination: action.purchaseCoordination,
          currents,
          updates: cloneDeep(currents),
          materialIds: Object.keys(currents),
          supplierMaterials,
          preferredSuppliers,
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
          state.preferredSuppliers,
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
  preferredSuppliers: Record<string, PreferredSupplier>,
) {
  return Object.fromEntries(
    purchaseCoordination?.purchaseCoordinationDetails.map((e) => [
      e.materialId,
      initCoordinationDetail(e, materials, preferredSuppliers),
    ]),
  );
}

function initCoordinationDetail(
  purchaseCoordinationDetail: PurchaseCoordinationDetail,
  materials: Map<string, Material>,
  preferredSuppliers: Record<string, PreferredSupplier>,
): CoordinationDetail {
  const material = materials.get(
    purchaseCoordinationDetail.materialId,
  );
  const amount = convertAmount({
    material,
    amount: purchaseCoordinationDetail.amount,
    reverse: true,
  });
  const preferredSupplier =
    preferredSuppliers[purchaseCoordinationDetail.materialId];
  return {
    id: purchaseCoordinationDetail.id,
    materialId: purchaseCoordinationDetail.materialId,
    approvedQuantity: amount,
    orderQuantity: amount,
    supplierId: preferredSupplier?.supplierId || "",
    price: preferredSupplier?.price || 0,
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
  preferredSupplierId: string,
) {
  const items = supplierMaterials.map((sm) => ({
    supplierId: sm.supplier.id,
    supplierName: sm.supplier.name,
    unitName: materials.get(materialId)?.others.unit?.name || "",
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
