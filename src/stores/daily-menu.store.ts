import { dailyMenuKey, type DailyMenu } from "@/services/domain";
import { create } from "zustand";

type DailyMenuStore = {
  dailyMenu: Map<string, DailyMenu>;
  push: (_: DailyMenu[]) => void;
};

export default create<DailyMenuStore>((set, get) => ({
  dailyMenu: new Map(),
  push: (data: DailyMenu[]) => {
    const dailyMenu = new Map(get().dailyMenu);
    data.forEach((el) => {
      const key = dailyMenuKey(el);
      const old = dailyMenu.get(key);
      if (!old?.updatedAt || el.updatedAt >= old.updatedAt) {
        dailyMenu.set(dailyMenuKey(el), el);
      }
    });
    set({ dailyMenu });
  },
}));
