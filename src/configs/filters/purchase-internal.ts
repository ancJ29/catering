import { PurchaseInternal } from "@/services/domain";
import { endOfWeek, startOfWeek } from "@/utils";

export type FilterType = {
  id: string;
  from: number;
  to: number;
  statuses: string[];
  receivingCateringIds: string[];
  deliveryCateringIds: string[];
};

export const defaultCondition: FilterType = {
  id: "",
  from: startOfWeek(Date.now()),
  to: endOfWeek(Date.now()),
  statuses: [],
  receivingCateringIds: [],
  deliveryCateringIds: [],
};

export function filter(pi: PurchaseInternal, condition?: FilterType) {
  if (
    condition?.statuses &&
    condition.statuses.length > 0 &&
    !condition.statuses.includes(pi.others.status)
  ) {
    return false;
  }
  if (
    condition?.receivingCateringIds &&
    condition.receivingCateringIds.length > 0 &&
    pi.others.receivingCateringId &&
    !condition.receivingCateringIds.includes(
      pi.others.receivingCateringId,
    )
  ) {
    return false;
  }
  if (
    condition?.deliveryCateringIds &&
    condition.deliveryCateringIds.length > 0 &&
    pi.deliveryCateringId &&
    !condition.deliveryCateringIds.includes(pi.deliveryCateringId)
  ) {
    return false;
  }
  if (condition?.from && pi.deliveryDate.getTime() < condition.from) {
    return false;
  }
  if (condition?.to && pi.deliveryDate.getTime() > condition.to) {
    return false;
  }
  return true;
}
