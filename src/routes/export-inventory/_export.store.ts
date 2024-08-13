import {
  piStatusSchema,
  WRType,
  wrTypeSchema,
} from "@/auto-generated/api-configs";
import {
  Customer,
  DailyMenu,
  getAllInventories,
  getBom,
  getDailyMenu,
  getPurchaseInternalsByCatering,
  Inventory,
  Material,
  PurchaseInternalCatering,
} from "@/services/domain";
import useAuthStore from "@/stores/auth.store";
import useCustomerStore from "@/stores/customer.store";
import useMaterialStore from "@/stores/material.store";
import {
  cloneDeep,
  convertAmountBackward,
  createStore,
  endOfDay,
  endOfWeek,
  roundToDecimals,
  startOfDay,
  startOfWeek,
} from "@/utils";
import {
  Case,
  ExportDetail,
  ExportInventoryForm,
  ExportReceipt,
  initialExportInventoryForm,
  Tab,
  Type,
} from "./_configs";
import { MenuMaterial } from "./components/Menu/_configs";

type State = {
  form: ExportInventoryForm;
  exportReceipt?: ExportReceipt;
  exportDetails: Record<string, ExportDetail>;
  currentInventories: Record<string, Inventory>;
  updateInventories: Record<string, Inventory>;
  activeTab: Tab;
  isSelectAll: boolean;
  selectedMaterialIds: string[];
  key: number;
  purchaseInternalCaterings: PurchaseInternalCatering[];
  currentDailyMenus: Record<string, DailyMenu>;
  dailyMenuDate: number;
  currentMenuMaterials: Record<string, MenuMaterial>;
  updateMenuMaterials: Record<string, MenuMaterial>;
  selectedMenuMaterialIds: string[];
};

enum ActionType {
  RESET = "RESET",
  INIT_DATA = "INIT_DATA",
  SET_FORM = "SET_FORM",
  SET_TAB = "SET_TAB",
  SET_AMOUNT_INVENTORY = "SET_AMOUNT_INVENTORY",
  SET_SELECT_ALL = "SET_SELECT_ALL",
  SET_SELECT = "SET_SELECT",
  SET_PURCHASE_INTERNAL_CATERINGS = "SET_PURCHASE_INTERNAL_CATERINGS",
  ADD_MATERIAL_TO_EXPORT = "ADD_MATERIAL_TO_EXPORT",
  ADD_PURCHASE_INTERNAL_TO_EXPORT = "ADD_PURCHASE_INTERNAL_TO_EXPORT",
  ADD_MENU_MATERIAL_TO_EXPORT = "ADD_MENU_MATERIAL_TO_EXPORT",
  SET_EXPORT_RECEIPT_TYPE = "SET_EXPORT_RECEIPT_TYPE",
  REMOVE_EXPORT_DETAIL = "REMOVE_EXPORT_DETAIL",
  SET_DAILY_MENU_DATE = "SET_DAILY_MENU_DATE",
  SET_EXPORT_AMOUNT = "SET_EXPORT_AMOUNT",
  SET_SELECT_MENU_MATERIAL = "SET_SELECT_MENU_MATERIAL",
}

type Action = {
  type: ActionType;
  form?: ExportInventoryForm;
  inventories?: Inventory[];
  tab?: Tab;
  amount?: number;
  isSelect?: boolean;
  materialId?: string;
  purchaseInternalCaterings?: PurchaseInternalCatering[];
  purchaseInternalCatering?: PurchaseInternalCatering;
  exportReceiptType?: WRType;
  dailyMenus?: DailyMenu[];
  date?: number;
  currentMenuMaterials?: Record<string, MenuMaterial>;
};

const defaultState = {
  form: initialExportInventoryForm,
  exportDetails: {},
  currentInventories: {},
  updateInventories: {},
  activeTab: Tab.STANDARD,
  isSelectAll: false,
  selectedMaterialIds: [],
  key: Date.now(),
  purchaseInternalCaterings: [],
  currentDailyMenus: {},
  dailyMenuDate: Date.now(),
  currentMenuMaterials: {},
  updateMenuMaterials: {},
  selectedMenuMaterialIds: [],
};

const { dispatch, ...store } = createStore<State, Action>(reducer, {
  ...defaultState,
});

export default {
  ...store,
  reset() {
    dispatch({ type: ActionType.RESET });
  },
  async initData() {
    const { cateringId } = useAuthStore.getState();
    if (!cateringId) {
      return;
    }
    const { materials } = useMaterialStore.getState();
    const { customersByCateringId } = useCustomerStore.getState();
    const customers = customersByCateringId.get(cateringId);
    const state = store.getSnapshot();
    const [inventories, purchaseInternalCaterings, dailyMenus] =
      await Promise.all([
        getAllInventories(cateringId),
        getPurchaseInternalsByCatering(
          startOfWeek(Date.now()),
          endOfWeek(Date.now()),
          undefined,
          cateringId,
          [piStatusSchema.Values.DG, piStatusSchema.Values.DD],
        ),
        getDailyMenu({
          from: startOfDay(state.dailyMenuDate),
          to: endOfDay(state.dailyMenuDate),
          customerIds:
            customers?.map((customer) => customer.id) || [],
        }),
      ]);
    const currentMenuMaterials = await initBomData(
      dailyMenus,
      materials,
      Object.fromEntries(
        inventories.map((inventory) => [
          inventory.materialId,
          inventory,
        ]),
      ),
    );
    dispatch({
      type: ActionType.INIT_DATA,
      inventories,
      purchaseInternalCaterings,
      dailyMenus,
      currentMenuMaterials,
    });
  },
  async getPurchaseInternalData(from: number, to: number) {
    const { cateringId } = useAuthStore.getState();
    const purchaseInternalCaterings =
      await getPurchaseInternalsByCatering(
        from,
        to,
        undefined,
        cateringId,
        [piStatusSchema.Values.DG, piStatusSchema.Values.DD],
      );
    dispatch({
      type: ActionType.SET_PURCHASE_INTERNAL_CATERINGS,
      purchaseInternalCaterings,
    });
  },
  setCase(_case: string) {
    const form = store.getSnapshot().form;
    form.case = _case as Case;
    form.type = null;
    dispatch({ type: ActionType.SET_FORM, form });
  },
  setType(type: string | null) {
    if (!type) {
      return;
    }
    const form = store.getSnapshot().form;
    form.type = type as Type;
    dispatch({ type: ActionType.SET_FORM, form });
  },
  setDate(date?: number) {
    if (!date) {
      return;
    }
    const form = store.getSnapshot().form;
    form.date = new Date(date);
    dispatch({ type: ActionType.SET_FORM, form });
  },
  setActiveTab(tab: Tab) {
    dispatch({ type: ActionType.SET_TAB, tab });
  },
  setAmountInventory(materialId: string, amount: number) {
    dispatch({
      type: ActionType.SET_AMOUNT_INVENTORY,
      materialId,
      amount,
    });
  },
  setIsSelectAll(isSelect: boolean) {
    dispatch({ type: ActionType.SET_SELECT_ALL, isSelect });
  },
  setSelectMaterial(materialId: string, isSelect: boolean) {
    dispatch({
      type: ActionType.SET_SELECT,
      materialId,
      isSelect,
    });
  },
  isSelected(materialId: string) {
    return store
      .getSnapshot()
      .selectedMaterialIds.includes(materialId);
  },
  getSelectedMaterialAmount() {
    return store.getSnapshot().selectedMaterialIds.length;
  },
  getSelectedMaterialTotal() {
    const { materials } = useMaterialStore.getState();
    const { cateringId } = useAuthStore.getState();
    const state = store.getSnapshot();
    const total = state.selectedMaterialIds.reduce(
      (sum, materialId) => {
        const amount =
          state.updateInventories[materialId]?.amount || 0;
        const price =
          materials.get(materialId)?.others.prices?.[cateringId || ""]
            ?.price || 0;
        return sum + amount * price;
      },
      0,
    );
    return total;
  },
  getInventory(materialId: string) {
    return (
      store.getSnapshot().currentInventories[materialId]?.amount || 0
    );
  },
  addMaterialToExportReceipt() {
    dispatch({ type: ActionType.ADD_MATERIAL_TO_EXPORT });
  },
  addPurchaseInternalToExportReceipt(
    purchaseInternalCatering?: PurchaseInternalCatering,
  ) {
    dispatch({
      type: ActionType.ADD_PURCHASE_INTERNAL_TO_EXPORT,
      purchaseInternalCatering,
    });
  },
  setExportReceiptType(type: string | null) {
    dispatch({
      type: ActionType.SET_EXPORT_RECEIPT_TYPE,
      exportReceiptType: type as WRType,
    });
  },
  getProductionDate(materialId: string) {
    return store.getSnapshot().currentInventories[materialId]?.others
      .expiryDays[0]?.productionDate;
  },
  getExpiryDate(materialId: string) {
    return store.getSnapshot().currentInventories[materialId]?.others
      .expiryDays[0]?.expiryDate;
  },
  getExportReceiptMaterialAmount() {
    return Object.keys(store.getSnapshot().exportDetails).length;
  },
  getExportReceiptMaterialTotal() {
    const { materials } = useMaterialStore.getState();
    const { cateringId } = useAuthStore.getState();
    const state = store.getSnapshot();
    const total = Object.values(
      store.getSnapshot().exportDetails,
    ).reduce((sum, exportDetail) => {
      const amount =
        state.updateInventories[exportDetail.materialId]?.amount || 0;
      const price =
        materials.get(exportDetail.materialId)?.others.prices?.[
          cateringId || ""
        ]?.price || 0;
      return sum + amount * price;
    }, 0);
    return total;
  },
  removeExportDetail(materialId: string) {
    dispatch({ type: ActionType.REMOVE_EXPORT_DETAIL, materialId });
  },
  async setDailyMenuDate(date?: number) {
    const { cateringId } = useAuthStore.getState();
    if (!date || !cateringId) {
      return;
    }
    const { materials } = useMaterialStore.getState();
    const { customersByCateringId } = useCustomerStore.getState();
    const customers = customersByCateringId.get(cateringId);
    const dailyMenus = await getDailyMenu({
      from: startOfDay(date),
      to: endOfDay(date),
      customerIds: customers?.map((customer) => customer.id) || [],
    });
    const currentMenuMaterials = await initBomData(
      dailyMenus,
      materials,
      store.getSnapshot().currentInventories,
    );
    dispatch({
      type: ActionType.SET_DAILY_MENU_DATE,
      date,
      dailyMenus,
      currentMenuMaterials,
    });
  },
  getExportAmount(materialId: string) {
    return store.getSnapshot().updateMenuMaterials[materialId]
      ?.exportAmount;
  },
  setExportAmount(materialId: string, amount: number | string) {
    dispatch({
      type: ActionType.SET_EXPORT_AMOUNT,
      materialId,
      amount: parseFloat(amount.toString()),
    });
  },
  isSelectMenuMaterial(materialId: string) {
    return store
      .getSnapshot()
      .selectedMenuMaterialIds.includes(materialId);
  },
  setSelectMenuMaterial(materialId: string, isSelect: boolean) {
    dispatch({
      type: ActionType.SET_SELECT_MENU_MATERIAL,
      materialId,
      isSelect,
    });
  },
  addMenuMaterialToExportReceipt() {
    dispatch({ type: ActionType.ADD_MENU_MATERIAL_TO_EXPORT });
  },
};

function reducer(action: Action, state: State): State {
  const { cateringId } = useAuthStore.getState();
  const { materials } = useMaterialStore.getState();
  const { customers } = useCustomerStore.getState();
  switch (action.type) {
    case ActionType.RESET:
      return {
        ...state,
        key: Date.now(),
        updateInventories: cloneDeep(state.updateInventories),
      };
      break;
    case ActionType.INIT_DATA:
      if (
        action.inventories !== undefined &&
        action.purchaseInternalCaterings !== undefined &&
        action.dailyMenus !== undefined &&
        action.currentMenuMaterials !== undefined
      ) {
        const inventories = Object.fromEntries(
          action.inventories.map((inventory) => [
            inventory.materialId,
            {
              ...inventory,
              amount: convertAmountBackward({
                material: materials.get(inventory.materialId),
                amount: inventory.amount,
              }),
            },
          ]),
        );
        const exportReceipt: ExportReceipt = {
          date: new Date(),
          departmentId: cateringId || "",
        };
        const currentDailyMenus = initDailyMenu(
          action.dailyMenus,
          customers,
        );
        return {
          ...state,
          key: Date.now(),
          currentInventories: inventories,
          updateInventories: cloneDeep(inventories),
          exportReceipt,
          purchaseInternalCaterings: action.purchaseInternalCaterings,
          currentDailyMenus,
          currentMenuMaterials: action.currentMenuMaterials,
          updateMenuMaterials: cloneDeep(action.currentMenuMaterials),
          selectedMenuMaterialIds: Object.keys(
            action.currentMenuMaterials,
          ),
        };
      }
      break;
    case ActionType.SET_FORM:
      if (action.form && state.exportReceipt) {
        state.exportReceipt = {
          ...state.exportReceipt,
          date: action.form.date,
        };
        return {
          ...state,
        };
      }
      break;
    case ActionType.SET_TAB:
      if (action.tab) {
        return {
          ...state,
          activeTab: action.tab,
        };
      }
      break;
    case ActionType.SET_AMOUNT_INVENTORY:
      if (action.materialId && action.amount) {
        state.updateInventories[action.materialId].amount =
          action.amount;
      }
      break;
    case ActionType.SET_SELECT_ALL:
      if (action.isSelect !== undefined) {
        state.isSelectAll = action.isSelect;
        if (action.isSelect) {
          state.selectedMaterialIds = Object.keys(
            state.currentInventories,
          );
        } else {
          state.selectedMaterialIds = [];
        }
        return { ...state, key: Date.now() };
      }
      break;
    case ActionType.SET_SELECT:
      if (action.materialId && action.isSelect !== undefined) {
        if (action.isSelect) {
          state.selectedMaterialIds.push(action.materialId);
        } else {
          state.selectedMaterialIds =
            state.selectedMaterialIds.filter(
              (id) => id !== action.materialId,
            );
        }
        return {
          ...state,
          key: Date.now(),
          isSelectAll:
            state.selectedMaterialIds.length ===
            Object.keys(state.currentInventories).length,
        };
      }
      break;
    case ActionType.SET_PURCHASE_INTERNAL_CATERINGS:
      if (action.purchaseInternalCaterings !== undefined) {
        return {
          ...state,
          purchaseInternalCaterings: action.purchaseInternalCaterings,
          key: Date.now(),
        };
      }
      break;
    case ActionType.ADD_MATERIAL_TO_EXPORT:
      if (state.exportReceipt) {
        const exportDetails: Record<string, ExportDetail> = {};
        state.selectedMaterialIds.forEach((materialId) => {
          const inventory = state.updateInventories[materialId];
          exportDetails[materialId] = {
            materialId,
            amount: inventory.amount,
            price:
              materials.get(materialId)?.others.prices?.[
                cateringId || ""
              ]?.price || 0,
            memo: "",
            name: "",
          };
        });
        state.exportReceipt = {
          ...state.exportReceipt,
          type: null,
        };
        return {
          ...state,
          exportDetails,
          key: Date.now(),
        };
      }
      break;
    case ActionType.ADD_PURCHASE_INTERNAL_TO_EXPORT:
      if (action.purchaseInternalCatering && state.exportReceipt) {
        state.exportReceipt = {
          ...state.exportReceipt,
          receivingCateringId:
            action.purchaseInternalCatering.others
              .receivingCateringId,
          type: wrTypeSchema.Values.XCK,
          receivingDate: action.purchaseInternalCatering.deliveryDate,
        };
        const exportDetails: Record<string, ExportDetail> = {};
        action.purchaseInternalCatering.purchaseInternalDetails.forEach(
          (e) => {
            exportDetails[e.materialId] = {
              materialId: e.materialId,
              amount: e.amount,
              price:
                materials.get(e.materialId)?.others.prices?.[
                  cateringId || ""
                ]?.price || 0,
              memo: "",
              name: "",
            };
          },
        );
        return {
          ...state,
          key: Date.now(),
          exportDetails,
        };
      }
      break;
    case ActionType.SET_EXPORT_RECEIPT_TYPE:
      if (action.exportReceiptType && state.exportReceipt) {
        state.exportReceipt = {
          ...state.exportReceipt,
          type: action.exportReceiptType,
        };
        return { ...state };
      }
      break;
    case ActionType.REMOVE_EXPORT_DETAIL:
      if (action.materialId) {
        delete state.exportDetails[action.materialId];
        return {
          ...state,
          key: Date.now(),
        };
      }
      break;
    case ActionType.SET_DAILY_MENU_DATE:
      if (
        action.date &&
        action.dailyMenus !== undefined &&
        action.currentMenuMaterials !== undefined
      ) {
        const currentDailyMenus = initDailyMenu(
          action.dailyMenus,
          customers,
        );
        return {
          ...state,
          currentDailyMenus,
          dailyMenuDate: action.date,
          key: Date.now(),
          currentMenuMaterials: action.currentMenuMaterials,
          updateMenuMaterials: cloneDeep(action.currentMenuMaterials),
          selectedMenuMaterialIds: Object.keys(
            action.currentMenuMaterials,
          ),
        };
      }
      break;
    case ActionType.SET_EXPORT_AMOUNT:
      if (action.materialId && action.amount) {
        state.updateMenuMaterials[action.materialId].exportAmount =
          action.amount;
        return {
          ...state,
          key: Date.now(),
        };
      }
      break;
    case ActionType.SET_SELECT_MENU_MATERIAL:
      if (action.materialId && action.isSelect !== undefined) {
        if (action.isSelect) {
          state.selectedMenuMaterialIds.push(action.materialId);
        } else {
          state.selectedMenuMaterialIds =
            state.selectedMenuMaterialIds.filter(
              (id) => id !== action.materialId,
            );
        }
      }
      break;
    case ActionType.ADD_MENU_MATERIAL_TO_EXPORT:
      if (state.exportReceipt) {
        const exportDetails: Record<string, ExportDetail> = {};
        state.selectedMenuMaterialIds.forEach((materialId) => {
          const amount =
            state.updateMenuMaterials[materialId].exportAmount;
          exportDetails[materialId] = {
            materialId,
            amount,
            price:
              materials.get(materialId)?.others.prices?.[
                cateringId || ""
              ]?.price || 0,
            memo: "",
            name: "",
          };
        });
        state.exportReceipt = {
          ...state.exportReceipt,
          type: null,
        };
        return {
          ...state,
          exportDetails,
          key: Date.now(),
        };
      }
      break;
  }
  return state;
}

function initDailyMenu(
  dailyMenus: DailyMenu[],
  customers: Map<string, Customer>,
) {
  const _dailyMenus = sortDailyMenus(dailyMenus, customers);
  const currents: Record<string, DailyMenu> = {};
  _dailyMenus?.forEach((dailyMenu) => {
    currents[dailyMenu.id] = dailyMenu;
  });
  return currents;
}

async function initBomData(
  dailyMenus: DailyMenu[],
  materials: Map<string, Material>,
  inventories: Record<string, Inventory>,
) {
  const productIds = dailyMenus.flatMap((dailyMenu) => {
    return Object.keys(dailyMenu.others.quantity);
  });
  const currentMenuMaterials: Record<string, MenuMaterial> = {};
  for (const productId of productIds) {
    const bom = await getBom(productId);
    const _bom = bom?.bom;
    if (!_bom) {
      continue;
    }
    for (const materialId of Object.keys(_bom)) {
      const amount = roundToDecimals(
        convertAmountBackward({
          material: materials.get(materialId),
          amount: _bom[materialId],
        }),
        10,
      );
      const inventory = convertAmountBackward({
        material: materials.get(materialId),
        amount: inventories[materialId]?.amount || 0,
      });
      currentMenuMaterials[materialId] = {
        materialId,
        amount,
        exportAmount: Math.min(inventory, amount),
        name: "",
      };
    }
  }
  return currentMenuMaterials;
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

  return dailyMenus?.sort((a, b) => {
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
