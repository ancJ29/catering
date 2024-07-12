import { PRStatus } from "@/auto-generated/api-configs";
import { ONE_DAY } from "@/utils";

export const initialPurchaseRequestForm: PurchaseRequestForm = {
  departmentId: null,
  deliveryDate: Date.now() + ONE_DAY,
  deliveryTime: "06:00",
  type: null,
  priority: null,
};

export type PurchaseRequestForm = {
  id?: string;
  departmentId: string | null;
  deliveryDate: number;
  deliveryTime: string;
  type: string | null;
  priority: string | null;
  status?: PRStatus;
};

export type RequestDetail = {
  id?: string;
  materialId: string;
  inventory: number;
  needToOrder: number;
  amount: number;
  supplierNote: string;
  internalNote: string;
  price: number;
};

export type MaterialExcel = {
  materialInternalCode: string;
  amount: number;
};
