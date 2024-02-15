import { getAllSuppliers, type Supplier } from "@/services/domain";
import { create } from "zustand";

type SupplierStore = {
  suppliers: Map<string, Supplier>;
  reload: (noCache?: boolean) => void;
};

export default create<SupplierStore>((set, get) => ({
  suppliers: new Map(),
  reload: async (noCache = false) => {
    if (!noCache && get().suppliers.size) {
      return;
    }
    const data = await getAllSuppliers(noCache);
    set(() => ({
      suppliers: new Map(data.map((e) => [e.id, e])),
    }));
  },
}));
