import {
  PCStatus,
  PRPriority,
  PRType,
} from "@/auto-generated/api-configs";

export const initialPurchaseCoordinationForm: PurchaseCoordinationForm =
  {
    id: "",
    receivingCateringId: "",
    deliveryDate: Date.now(),
    deliveryTime: "06:00",
    status: "CXL",
    type: "HN",
    priority: "BT",
  };

export type PurchaseCoordinationForm = {
  id: string;
  receivingCateringId: string;
  deliveryDate: number;
  deliveryTime: string;
  status: PCStatus;
  type: PRType;
  priority: PRPriority;
};

export type CoordinationDetail = {
  id: string;
  materialId: string;
  approvedQuantity: number;
  orderQuantity: number;
  supplierId: string | null;
  price: number;
  supplierNote: string;
  internalNote: string;
};

export type SupplierSelectItemData = {
  supplierId: string;
  supplierName: string;
  unitName: string;
  price: number;
};
