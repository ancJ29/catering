import {
  getAllMonthlyInventories,
  getAllWarehouseExports,
  getAllWarehouseImports,
  MonthlyInventory,
  WarehouseReceipt,
  WarehouseReceiptDetail,
} from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import useMaterialStore from "@/stores/material.store";
import useSupplierStore from "@/stores/supplier.store";
import {
  convertAmountBackward,
  createStore,
  endOfMonth,
  startOfMonth,
} from "@/utils";
import { Detail } from "./_configs";

type State = {
  date: number;
  currents: Record<string, MonthlyInventory>;
  warehouseExports: Record<string, WarehouseReceiptDetail[]>;
  warehouseImports: Record<string, WarehouseReceiptDetail[]>;
  key: number;
};

enum ActionType {
  RESET = "RESET",
  SET_MONTHLY_INVENTORY = "SET_MONTHLY_INVENTORY",
}

type Action = {
  type: ActionType;
  cateringId?: string;
  monthlyInventories?: MonthlyInventory[];
  date?: number;
  warehouseExports?: WarehouseReceipt[];
  warehouseImports?: WarehouseReceipt[];
};

const defaultState: State = {
  date: Date.now(),
  currents: {},
  warehouseExports: {},
  warehouseImports: {},
  key: Date.now(),
};

const { dispatch, ...store } = createStore<State, Action>(reducer, {
  ...defaultState,
});

export default {
  ...store,
  async initData(date?: number) {
    const _date = date ?? store.getSnapshot().date;
    const [monthlyInventories, warehouseExports, warehouseImports] =
      await Promise.all([
        getAllMonthlyInventories(new Date(_date)),
        getAllWarehouseExports(
          startOfMonth(_date),
          endOfMonth(_date),
        ),
        getAllWarehouseImports(
          startOfMonth(_date),
          endOfMonth(_date),
        ),
      ]);
    dispatch({
      type: ActionType.SET_MONTHLY_INVENTORY,
      monthlyInventories,
      date,
      warehouseExports,
      warehouseImports,
    });
  },
  isMaterialType(id: string, type: string) {
    const { materials } = useMaterialStore.getState();
    const materialId = store.getSnapshot().currents[id]?.materialId;
    const material = materials.get(materialId);
    return material?.others?.type === type;
  },
  isMaterialGroup(id: string, group: string) {
    const { materials } = useMaterialStore.getState();
    const materialId = store.getSnapshot().currents[id]?.materialId;
    const material = materials.get(materialId);
    return material?.others?.group === group;
  },
  getImportAmount(cateringId: string, materialId: string) {
    const { materials } = useMaterialStore.getState();
    const state = store.getSnapshot();
    const key = `${cateringId}-${materialId}`;
    const details = state.warehouseImports[key];
    if (!details) {
      return 0;
    }
    const total = details.reduce((totalAmount, detail) => {
      const amount = detail.amount;
      return totalAmount + amount;
    }, 0);
    return convertAmountBackward({
      material: materials.get(materialId),
      amount: total,
    });
  },
  getExportAmount(cateringId: string, materialId: string) {
    const { materials } = useMaterialStore.getState();
    const state = store.getSnapshot();
    const key = `${cateringId}-${materialId}`;
    const details = state.warehouseExports[key];
    if (!details) {
      return 0;
    }
    const total = details.reduce((totalAmount, detail) => {
      const amount = detail.amount;
      return totalAmount + amount;
    }, 0);
    return convertAmountBackward({
      material: materials.get(materialId),
      amount: total,
    });
  },
  getWarehouse(
    monthlyInventoryId: string,
    cateringId: string,
    materialId: string,
  ) {
    const { materials } = useMaterialStore.getState();
    const { suppliers } = useSupplierStore.getState();
    const { caterings } = useCateringStore.getState();
    const warehouse: Detail[] = [];
    const state = store.getSnapshot();
    const key = `${cateringId}-${materialId}`;
    const warehouseExportDetails = state.warehouseExports[key];
    const warehouseImportDetails = state.warehouseImports[key];

    if (!warehouseExportDetails && !warehouseImportDetails) {
      return warehouse;
    }

    const combinedDetails = [
      ...(warehouseExportDetails || []).map((detail) => ({
        ...detail,
        amount: -detail.amount,
      })),
      ...(warehouseImportDetails || []),
    ];
    combinedDetails.sort(
      (a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    let beginAmount = convertAmountBackward({
      material: materials.get(materialId),
      amount: state.currents[monthlyInventoryId]?.amount || 0,
    });

    combinedDetails.forEach((detail) => {
      const amount = convertAmountBackward({
        material: materials.get(materialId),
        amount: detail.amount,
      });
      const supplierName = suppliers.get(
        detail.supplierId || "",
      )?.name;
      const departmentName =
        caterings.get(detail.departmentId)?.name || "N/A";
      const cateringName = caterings.get(
        detail.cateringId || "",
      )?.name;
      warehouse.push({
        id: detail.id,
        date: detail.date,
        type: detail.type,
        deliveryCatering:
          detail.amount < 0
            ? departmentName
            : supplierName || cateringName || "",
        receiveCatering:
          detail.amount < 0 ? cateringName || "" : departmentName,
        materialId: detail.materialId,
        beginAmount: beginAmount,
        amount,
        endAmount: beginAmount + amount,
        price: detail.price,
      });
      beginAmount += detail.amount;
    });

    return warehouse;
  },
};

function reducer(action: Action, state: State): State {
  switch (action.type) {
    case ActionType.SET_MONTHLY_INVENTORY:
      if (
        action.monthlyInventories !== undefined &&
        action.warehouseExports !== undefined &&
        action.warehouseImports !== undefined
      ) {
        const currents = Object.fromEntries(
          action.monthlyInventories.map((el) => [el.id, el]),
        );
        const warehouseExports = initWarehouseReceipts(
          action.warehouseExports,
        );
        const warehouseImports = initWarehouseReceipts(
          action.warehouseImports,
        );
        return {
          ...state,
          currents,
          key: Date.now(),
          date: action.date ?? state.date,
          warehouseExports,
          warehouseImports,
        };
      }
      break;
  }
  return state;
}

function initWarehouseReceipts(
  receipts: WarehouseReceipt[],
): Record<string, WarehouseReceiptDetail[]> {
  const warehouse: Record<string, WarehouseReceiptDetail[]> = {};

  receipts.forEach((receipt) => {
    receipt.warehouseReceiptDetails.forEach((detail) => {
      const key = `${receipt.departmentId}-${detail.materialId}`;
      if (!warehouse[key]) {
        warehouse[key] = [];
      }
      warehouse[key].push({
        ...detail,
        date: receipt.date,
        type: receipt.others.type,
        departmentId: receipt.departmentId,
        supplierId: receipt.others.supplierId,
        cateringId: receipt.others.cateringId,
      });
    });
  });
  return warehouse;
}
