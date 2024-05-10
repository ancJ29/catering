import { PurchaseOrder } from "@/services/domain";
import { ONE_DAY, endOfDay, startOfDay } from "@/utils";

export type FilterType = {
  id: string;
  from: number;
  to: number;
  type: string;
  priority: string;
  status: string;
  departmentName: string;
};

export const defaultCondition: FilterType = {
  id: "",
  from: startOfDay(Date.now() - ONE_DAY),
  to: endOfDay(Date.now() + ONE_DAY),
  type: "",
  priority: "",
  status: "",
  departmentName: "",
};

export function filter(po: PurchaseOrder, condition?: FilterType) {
  if (
    condition?.from &&
    po.deliveryDate.getTime() < condition?.from
  ) {
    return false;
  }
  if (condition?.to && po.deliveryDate.getTime() > condition?.to) {
    return false;
  }
  if (condition?.type && po.others.type !== condition.type) {
    return false;
  }
  if (
    condition?.priority &&
    po.others.priority !== condition.priority
  ) {
    return false;
  }
  if (condition?.status && po.others.status !== condition.status) {
    return false;
  }
  if (
    condition?.departmentName &&
    po.others.departmentName !== condition.departmentName
  ) {
    return false;
  }
  return true;
}
