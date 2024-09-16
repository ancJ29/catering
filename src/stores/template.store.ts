import { getAllTemplates, Template } from "@/services/domain";
import { create } from "zustand";

type TemplateStore = {
  loadedAll: boolean;
  templates: Map<string, Template>;
  set: (templates: Template[]) => void;
  reload: (noCache?: boolean) => Promise<void>;
};

export default create<TemplateStore>((set, get) => ({
  loadedAll: false,
  templates: new Map(),
  set: (templates) => {
    set(({ templates: _templates }) => {
      const t = new Map(_templates);
      templates.forEach((e) => t.set(e.id, e));
      return { templates: t };
    });
  },

  reload: async (noCache = false) => {
    if (!noCache && get().loadedAll) {
      return;
    }
    const data = await getAllTemplates(noCache);
    set(() => ({
      loadedAll: true,
      templates: new Map(data.map((e) => [e.type, e])),
    }));
  },
}));
