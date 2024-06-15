import { Actions } from "@/auto-generated/api-configs";
import { User } from "@/routes/user-management/_configs";
import { loadAll } from "@/services/data-loaders";
import logger from "@/services/logger";
import { create } from "zustand";

type UserStore = {
  loadedAll: boolean;
  users: Map<string, User>;
  set: (products: User[]) => void;
  reload: (noCache?: boolean) => Promise<void>;
};

export default create<UserStore>((set, get) => ({
  loadedAll: false,
  users: new Map(),
  set: (users) => {
    set(({ users: _users }) => {
      const s = new Map(_users);
      users.forEach((e) => s.set(e.id, e));
      return { users: s };
    });
  },
  reload: async (noCache = false) => {
    if (!noCache && get().loadedAll) {
      return;
    }
    const data = await loadAll<User>({
      key: "users",
      noCache,
      action: Actions.GET_USERS,
    });
    logger.info(`Loaded ${data.length} users`);
    set(() => ({
      loadedAll: true,
      users: new Map(data.map((e) => [e.id, e])),
    }));
  },
}));
