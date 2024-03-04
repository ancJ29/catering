import {
  dailyMenuKey,
  getAlertMenuItems,
  type DailyMenu,
} from "@/services/domain";
import useAuthStore from "@/stores/auth.store";
import { create } from "zustand";

type DailyMenuStore = {
  dailyMenu: Map<string, DailyMenu>;
  alertItems: DailyMenu[];
  loadAlertItems: () => Promise<void>;
  push: (_: DailyMenu[]) => void;
};

export default create<DailyMenuStore>((set, get) => ({
  dailyMenu: new Map(),
  alertItems: [],
  loadAlertItems: async () => {
    const { role, cateringId } = useAuthStore.getState();
    const alertItems = await getAlertMenuItems(role, cateringId);
    set({ alertItems });
  },
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
