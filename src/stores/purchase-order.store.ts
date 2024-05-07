import {
  PurchaseOrder,
  getAllPurchaseOrders,
} from "@/services/domain";
import { create } from "zustand";

type PurchaseOrderStore = {
  loadedAll: boolean;
  purchaseOrders: Map<string, PurchaseOrder>;
  set: (purchaseOrders: PurchaseOrder[]) => void;
  reload: (
    noCache?: boolean,
    from?: number,
    to?: number,
  ) => Promise<void>;
};

export default create<PurchaseOrderStore>((set, get) => ({
  loadedAll: false,
  purchaseOrders: new Map(),
  set: (purchaseOrders) => {
    set(() => ({
      purchaseOrders: new Map(purchaseOrders.map((e) => [e.id, e])),
    }));
  },
  reload: async (noCache = false, from, to) => {
    if (!noCache && get().loadedAll) {
      return;
    }
    const data = await getAllPurchaseOrders(noCache, from, to);
    set(() => ({
      loadedAll: true,
      purchaseOrders: new Map(data.map((e) => [e.id, e])),
    }));
  },
}));
