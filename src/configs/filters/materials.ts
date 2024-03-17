import { Material } from "@/services/domain";

export type FilterType = {
  type: string;
  group: string;
};

export const defaultCondition: FilterType = {
  type: "",
  group: "",
};

export function filter(m: Material, condition?: FilterType) {
  if (condition?.group && m.others.group !== condition.group) {
    return false;
  }
  if (condition?.type && m.others.type !== condition.type) {
    return false;
  }
  return true;
}
