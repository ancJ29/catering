import { getAllSuppliers, type Supplier } from "@/services/domain";
import { create } from "zustand";

type SupplierStore = {
  loadedAll: boolean;
  suppliers: Map<string, Supplier>;
  set: (suppliers: Supplier[]) => void;
  reload: (noCache?: boolean) => Promise<void>;
};

export default create<SupplierStore>((set, get) => ({
  loadedAll: false,
  suppliers: new Map(),
  set: (suppliers) => {
    set(({ suppliers: _suppliers }) => {
      const s = new Map(_suppliers);
      suppliers.forEach((e) => s.set(e.id, e));
      return { suppliers: s };
    });
  },
  reload: async (noCache = false) => {
    if (!noCache && get().loadedAll) {
      return;
    }
    const data = await getAllSuppliers(noCache);
    set(() => ({
      loadedAll: true,
      suppliers: new Map(data.map((e) => [e.id, e])),
    }));
  },
}));
