import { PurchaseRequest } from "@/services/domain";
import { ONE_DAY, startOfDay } from "@/utils";

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
  from: startOfDay(Date.now() - ONE_DAY),
  to: Date.now() + ONE_DAY,
  types: [],
  priorities: [],
  statuses: [],
  departmentIds: [],
};

export function filter(pr: PurchaseRequest, condition?: FilterType) {
  if (
    condition?.types &&
    condition.types.length > 0 &&
    !condition.types.includes(pr.others.type)
  ) {
    return false;
  }
  if (
    condition?.priorities &&
    condition.priorities.length > 0 &&
    !condition.priorities.includes(pr.others.priority)
  ) {
    return false;
  }
  if (
    condition?.statuses &&
    condition.statuses.length > 0 &&
    !condition.statuses.includes(pr.others.status)
  ) {
    return false;
  }
  if (
    condition?.departmentIds &&
    condition.departmentIds.length > 0 &&
    pr.departmentId &&
    !condition.departmentIds.includes(pr.departmentId)
  ) {
    return false;
  }
  if (condition?.from && pr.deliveryDate.getTime() < condition.from) {
    return false;
  }
  if (condition?.to && pr.deliveryDate.getTime() > condition.to) {
    return false;
  }
  return true;
}
