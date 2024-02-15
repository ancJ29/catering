import {
  getAllSuppliers,
  getSupplierById,
  type Supplier,
} from "@/services/domain";
import logger from "@/services/logger";
import { create } from "zustand";

type SupplierStore = {
  loadedAll: boolean;
  suppliers: Map<string, Supplier>;
  load: (id: string) => Promise<void>;
  reload: (noCache?: boolean) => Promise<void>;
  set: (suppliers: Supplier[]) => void;
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
  load: async (id: string) => {
    if (!id || get().suppliers.has(id)) {
      return;
    }
    const supplier = await getSupplierById(id);
    supplier &&
      set(({ suppliers }) => ({
        suppliers: new Map(suppliers).set(id, supplier),
      }));
  },
  reload: async (noCache = false) => {
    if (!noCache && get().loadedAll) {
      return;
    }
    logger.info("Reloading suppliers");
    const data = await getAllSuppliers(noCache);
    set(() => ({
      loadedAll: true,
      suppliers: new Map(data.map((e) => [e.id, e])),
    }));
  },
}));
