import { payloadSchema } from "@/auto-generated/api-configs";
import logger from "@/services/logger";
import { Payload } from "@/types";
import jwtDecode from "jwt-decode";
import { z } from "zod";
import { create } from "zustand";

const schema = z.object({ payload: payloadSchema });

type AuthStore = {
  token: string;
  user: Payload | null;
  loadToken: () => void;
  setToken: (token: string, remember?: boolean) => void;
  removeToken: () => void;
};

export default create<AuthStore>((set, get) => ({
  token: "",
  user: null,

  loadToken: () => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");
    get().setToken(token || "");
  },

  setToken: (token: string, remember?: boolean) => {
    if (token) {
      const user = _decode(token);
      logger.info("User logged in", user);
      set(() => (user ? { user, token } : { user: null, token: "" }));
      if (user) {
        remember
          ? localStorage.setItem("token", token)
          : sessionStorage.setItem("token", token);
      }
    }
  },

  removeToken: () => {
    set(() => ({ user: null, token: "" }));
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
  },
}));

function _decode(token: string) {
  const data = jwtDecode(token);
  const res = schema.safeParse(data);
  return res.success ? res.data.payload : null;
}
