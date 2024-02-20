import {
  getAllDepartments,
  type Department,
} from "@/services/domain";
import useMetaDataStore from "@/stores/meta-data.store";
import { create } from "zustand";

type CateringStore = {
  caterings: Map<string, Department>;
  reload: () => Promise<void>;
};

export default create<CateringStore>((set, get) => ({
  caterings: new Map(),
  reload: async () => {
    if (get().caterings.size) {
      return;
    }
    const kitchenType = useMetaDataStore.getState().kitchenType;
    if (kitchenType) {
      const data = await getAllDepartments(kitchenType);
      set(() => ({
        caterings: new Map(data.map((e) => [e.id, e])),
      }));
    }
  },
}));
