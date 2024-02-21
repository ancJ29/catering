import { getAllProducts, type Product } from "@/services/domain";
import { create } from "zustand";

type ProductStore = {
  loadedAll: boolean;
  products: Map<string, Product>;
  set: (products: Product[]) => void;
  reload: (noCache?: boolean) => Promise<void>;
};

export default create<ProductStore>((set, get) => ({
  loadedAll: false,
  products: new Map(),
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
    set(() => ({
      loadedAll: true,
      products: new Map(data.map((e) => [e.id, e])),
    }));
  },
}));
