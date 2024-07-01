import { POStatus } from "@/auto-generated/api-configs";

export const initialPurchaseOrderForm: PurchaseOrderForm = {
  departmentId: "",
  deliveryDate: Date.now(),
  deliveryTime: "06:00",
  supplierId: "",
  status: "DG",
};

export type PurchaseOrderForm = {
  departmentId: string;
  deliveryDate: number;
  deliveryTime: string;
  supplierId: string;
  status: POStatus;
};
