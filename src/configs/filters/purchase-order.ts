import { PurchaseOrder } from "@/services/domain";

export type FilterType = {
  id: string;
  type: string;
  priority: string;
  status: string;
  departmentName: string;
};

export const defaultCondition: FilterType = {
  id: "",
  type: "",
  priority: "",
  status: "",
  departmentName: "",
};

export function filter(m: PurchaseOrder, condition?: FilterType) {
  if (condition?.type && m.others.type !== condition.type) {
    return false;
  }
  if (
    condition?.priority &&
    m.others.priority !== condition.priority
  ) {
    return false;
  }
  if (condition?.status && m.others.status !== condition.status) {
    return false;
  }
  if (
    condition?.departmentName &&
    m.others.departmentName !== condition.departmentName
  ) {
    return false;
  }
  return true;
}
