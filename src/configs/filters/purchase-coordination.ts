import { PurchaseCoordination } from "@/services/domain";
import { endOfWeek, startOfWeek } from "@/utils";

export type FilterType = {
  id: string;
  from: number;
  to: number;
  types: string[];
  priorities: string[];
  statuses: string[];
  receivingCateringIds: string[];
};

export const defaultCondition: FilterType = {
  id: "",
  from: startOfWeek(Date.now()),
  to: endOfWeek(Date.now()),
  types: [],
  priorities: [],
  statuses: [],
  receivingCateringIds: [],
};

export function filter(
  pc: PurchaseCoordination,
  condition?: FilterType,
) {
  if (
    condition?.types &&
    condition.types.length > 0 &&
    !condition.types.includes(pc.others.type)
  ) {
    return false;
  }
  if (
    condition?.priorities &&
    condition.priorities.length > 0 &&
    !condition.priorities.includes(pc.others.priority)
  ) {
    return false;
  }
  if (
    condition?.statuses &&
    condition.statuses.length > 0 &&
    !condition.statuses.includes(pc.others.status)
  ) {
    return false;
  }
  if (
    condition?.receivingCateringIds &&
    condition.receivingCateringIds.length > 0 &&
    pc.others.receivingCateringId &&
    !condition.receivingCateringIds.includes(
      pc.others.receivingCateringId,
    )
  ) {
    return false;
  }
  if (condition?.from && pc.deliveryDate.getTime() < condition.from) {
    return false;
  }
  if (condition?.to && pc.deliveryDate.getTime() > condition.to) {
    return false;
  }
  return true;
}
