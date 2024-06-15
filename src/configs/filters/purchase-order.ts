import { PurchaseOrder } from "@/services/domain/purchase-order";
import { endOfWeek, startOfWeek } from "@/utils";

export type FilterType = {
  id: string;
  from: number;
  to: number;
  types: string[];
  priorities: string[];
  statuses: string[];
  departmentIds: string[];
};

export const defaultCondition: FilterType = {
  id: "",
  from: startOfWeek(Date.now()),
  to: endOfWeek(Date.now()),
  types: [],
  priorities: [],
  statuses: [],
  departmentIds: [],
};

export function filter(po: PurchaseOrder, condition?: FilterType) {
  if (
    condition?.types &&
    condition.types.length > 0 &&
    !condition.types.includes(po.others.type)
  ) {
    return false;
  }
  if (
    condition?.priorities &&
    condition.priorities.length > 0 &&
    !condition.priorities.includes(po.others.priority)
  ) {
    return false;
  }
  if (
    condition?.statuses &&
    condition.statuses.length > 0 &&
    !condition.statuses.includes(po.others.status)
  ) {
    return false;
  }
  if (
    condition?.departmentIds &&
    condition.departmentIds.length > 0 &&
    po.others.cateringId &&
    !condition.departmentIds.includes(po.others.cateringId)
  ) {
    return false;
  }
  if (condition?.from && po.deliveryDate.getTime() < condition.from) {
    return false;
  }
  if (condition?.to && po.deliveryDate.getTime() > condition.to) {
    return false;
  }
  return true;
}
