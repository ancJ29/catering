import { ClientRoles } from "@/auto-generated/api-configs";
import {
  dailyMenuKey,
  loadTodayMenu,
  type DailyMenu,
} from "@/services/domain";
import useAuthStore from "@/stores/auth.store";
import { create } from "zustand";

type DailyMenuStore = {
  dailyMenu: Map<string, DailyMenu>;
  alertItems: DailyMenu[];
  loadTodayMenu: () => Promise<void>;
  push: (_: DailyMenu[]) => void;
};

export default create<DailyMenuStore>((set, get) => ({
  dailyMenu: new Map(),
  alertItems: [],
  loadTodayMenu: async (noCache = false) => {
    const user = useAuthStore.getState().user;
    const role = user?.others.roles?.[0];
    if (!role || ![ClientRoles.PRODUCTION, ClientRoles.CATERING].includes(role)) {
      return;
    }
    const data = await loadTodayMenu(noCache);
    if (role == ClientRoles.PRODUCTION) {
      const alertItems = data?.filter(
        (el) => el.others.status === "NEW",
      );
      set({ alertItems });
    }
    if (role == ClientRoles.CATERING) {
      const cateringId = user?.departmentIds?.[0];
      if (cateringId) {
        const alertItems = data
          .filter((el) => el.others.cateringId === cateringId)
          .filter((el) => el.others.status === "WAITING");
        set({ alertItems });
      }
    }
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
