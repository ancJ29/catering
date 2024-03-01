import { getAllProducts, type Product } from "@/services/domain";
import logger from "@/services/logger";
import { unique } from "@/utils";
import { create } from "zustand";

type ProductStore = {
  loadedAll: boolean;
  products: Map<string, Product>;
  allTypes: string[];
  set: (products: Product[]) => void;
  reload: (noCache?: boolean) => Promise<void>;
};

export default create<ProductStore>((set, get) => ({
  loadedAll: false,
  products: new Map(),
  allTypes: [],
  set: (products) => {
    set(({ products: _products }) => {
      const s = new Map(_products);
      products.forEach((e) => s.set(e.id, e));
      return { products: s };
    });
  },
  reload: async (noCache = false) => {
    if (!noCache && get().loadedAll) {
      return;
    }
    const data = await getAllProducts(noCache);
    logger.info(`Loaded ${data.length} products`);
    const allTypes = unique(data.map((e) => e.others.type));
    set(() => ({
      allTypes,
      loadedAll: true,
      products: new Map(data.map((e) => [e.id, e])),
    }));
  },
}));
