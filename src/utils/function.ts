import useMaterialStore from "@/stores/material.store";
import { unique } from "./array";

export function blank() {
  // intentionally left blank
}

export function findSuppliersByCateringId(cateringId: string) {
  const { materials } = useMaterialStore.getState();
  const suppliers: string[] = [];
  for (const material of materials.values()) {
    if (
      material.others.prices &&
      material.others.prices[cateringId]
    ) {
      suppliers.push(material.others.prices[cateringId].supplierId);
    }
  }
  return unique(suppliers);
}
