import { getAllCustomers, type Customer } from "@/services/domain";
import { create } from "zustand";

type CateringStore = {
  customers: Map<string, Customer>;
  idByName: Map<string, string>;
  reload: () => Promise<void>;
};

export default create<CateringStore>((set, get) => ({
  customers: new Map(),
  idByName: new Map(),
  reload: async () => {
    if (get().customers.size) {
      return;
    }
    const data = await getAllCustomers();
    set(() => ({
      idByName: new Map(data.map((e) => [e.name, e.id])),
      customers: new Map(data.map((e) => [e.id, e])),
    }));
  },
}));
