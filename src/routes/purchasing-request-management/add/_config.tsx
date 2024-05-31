import { ONE_DAY } from "@/utils";

export const initialValues: AddPurchaseRequestForm = {
  departmentId: null,
  deliveryDate: Date.now() + ONE_DAY,
  deliveryTime: "06:00",
  type: null,
  priority: null,
};

export type AddPurchaseRequestForm = {
  departmentId: string | null;
  deliveryDate: number;
  deliveryTime: string;
  type: string | null;
  priority: string | null;
};

export type PurchaseDetail = {
  materialId: string;
  inventory: number;
  needToOrder: number;
  amount: number;
  supplierNote: string;
  internalNote: string;
};

export type MaterialExcel = {
  materialInternalCode: string;
  amount: number;
};
