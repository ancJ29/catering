import { getAllMaterials, type Material } from "@/services/domain";
import { create } from "zustand";

type MaterialStore = {
  loadedAll: boolean;
  materials: Map<string, Material>;
  set: (materials: Material[]) => void;
  reload: (noCache?: boolean) => Promise<void>;
};

export default create<MaterialStore>((set, get) => ({
  loadedAll: false,
  materials: new Map(),
  set: (materials) => {
    set(({ materials: _materials }) => {
      const m = new Map(_materials);
      materials.forEach((e) => m.set(e.id, e));
      return { materials: m };
    });
  },
  reload: async (noCache = false) => {
    if (!noCache && get().loadedAll) {
      return;
    }
    const data = await getAllMaterials(noCache);
    set(() => ({
      loadedAll: true,
      materials: new Map(data.map((e) => [e.id, e])),
    }));
  },
}));
