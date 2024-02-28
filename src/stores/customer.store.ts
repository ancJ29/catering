import { getAllCustomers, type Customer } from "@/services/domain";
import { create } from "zustand";

type CateringStore = {
  customersByCateringId: Map<string, Customer[]>;
  customers: Map<string, Customer>;
  idByName: Map<string, string>;
  reload: () => Promise<void>;
};

export default create<CateringStore>((set, get) => ({
  customers: new Map(),
  customersByCateringId: new Map(),
  idByName: new Map(),
  reload: async () => {
    if (get().customers.size) {
      return;
    }
    const data = await getAllCustomers();
    const customersByCateringId = new Map();
    data.forEach((c) => {
      const cateringId = c.others.cateringId;
      if (cateringId) {
        if (customersByCateringId.has(cateringId)) {
          customersByCateringId.get(cateringId).push(c);
        } else {
          customersByCateringId.set(cateringId, [c]);
        }
      }
    });
    set(() => ({
      customersByCateringId,
      idByName: new Map(data.map((e) => [e.name, e.id])),
      customers: new Map(data.map((e) => [e.id, e])),
    }));
  },
}));
