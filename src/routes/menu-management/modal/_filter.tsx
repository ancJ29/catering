import { Product } from "@/services/domain";

export type FilterType = {
  type: string;
};

export const defaultCondition: FilterType = {
  type: "",
};

export function filter(p: Product, x?: FilterType) {
  if (!x) {
    return true;
  }
  if (x.type && p.others.type !== x.type) {
    return false;
  }
  return true;
}
