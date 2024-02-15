import { getAllMaterials, type Material } from "@/services/domain";
import { create } from "zustand";

type MaterialStore = {
  materials: Map<string, Material>;
  reload: (noCache?: boolean) => Promise<void>;
};

export default create<MaterialStore>((set, get) => ({
  materials: new Map(),
  reload: async (noCache = false) => {
    if (!noCache && get().materials.size) {
      return;
    }
    const data = await getAllMaterials(noCache);
    set(() => ({
      materials: new Map(data.map((e) => [e.id, e])),
    }));
  },
}));
