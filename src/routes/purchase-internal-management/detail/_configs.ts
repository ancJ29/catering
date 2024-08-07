import { PIStatus } from "@/auto-generated/api-configs";

export const initialPurchaseInternalForm: PurchaseInternalForm = {
  id: "",
  receivingCateringId: "",
  deliveryCateringId: "",
  deliveryDate: Date.now(),
  deliveryTime: "06:00",
  status: "DG",
  prCode: "",
  purchaseRequestId: "",
};

export type PurchaseInternalForm = {
  id: string;
  receivingCateringId: string;
  deliveryCateringId: string;
  deliveryDate: number;
  deliveryTime: string;
  status: PIStatus;
  prCode: string;
  purchaseRequestId: string;
};
