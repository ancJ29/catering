import { ClientRoles } from "@/auto-generated/api-configs";
import {
  getAllDepartments,
  type Department,
} from "@/services/domain";
import { create } from "zustand";

type CateringStore = {
  caterings: Map<string, Department>;
  names: string[];
  reload: () => Promise<void>;
};

export default create<CateringStore>((set, get) => ({
  caterings: new Map(),
  names: [],
  reload: async () => {
    if (get().caterings.size) {
      return;
    }
    let data = await getAllDepartments();
    data = data.filter((e) => e.others.role === ClientRoles.CATERING);
    set(() => ({
      names: data.map((e) => e.name),
      caterings: new Map(data.map((e) => [e.id, e])),
    }));
  },
}));
