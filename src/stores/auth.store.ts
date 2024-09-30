import {
  ClientRoles,
  payloadSchema,
} from "@/auto-generated/api-configs";
import logger from "@/services/logger";
import { Payload } from "@/types";
import jwtDecode from "jwt-decode";
import { z } from "zod";
import { create } from "zustand";

const schema = z.object({ payload: payloadSchema });

type AuthStore = {
  token: string;
  user: Payload | null;
  isCatering?: boolean;
  role?: ClientRoles;
  cateringId?: string;
  loadToken: () => void;
  setToken: (token: string, remember?: boolean) => void;
  removeToken: () => void;
};

export default create<AuthStore>((set, get) => ({
  token: "",
  user: null,

  loadToken: () => {
    if (!localStorage.__LAST_LOGIN__) {
      return;
    }
    const ONE_DAY = 1000 * 60 * 60 * 24;
    const today = Math.floor(Date.now() / ONE_DAY);
    const lastLogin = parseInt(localStorage.__LAST_LOGIN__ || "0");
    const loginDate = Math.floor(lastLogin / ONE_DAY);
    if (today !== loginDate) {
      delete localStorage.__TOKEN__;
      delete sessionStorage.__TOKEN__;
    } else {
      const token =
        localStorage.__TOKEN__ || sessionStorage.__TOKEN__;
      get().setToken(token || "");
    }
  },

  setToken: (token: string, remember?: boolean) => {
    if (token) {
      const user = _decode(token);
      if (!user) {
        return;
      }
      logger.trace("User logged in", user);
      const isCatering = user?.roles.includes(ClientRoles.CATERING);
      const role = user.others.roles?.[0];
      const cateringId =
        role === ClientRoles.CATERING
          ? user.departmentIds?.[0]
          : undefined;
      set(() => ({
        user,
        role,
        cateringId,
        token: user ? token : "",
        isCatering,
      }));
      localStorage.__LAST_LOGIN__ = Date.now();
      if (remember) {
        localStorage.__TOKEN__ = token;
      } else {
        sessionStorage.__TOKEN__ = token;
      }
    }
  },

  removeToken: () => {
    set(() => ({ user: null, token: "" }));
    delete localStorage.__TOKEN__;
    delete sessionStorage.__TOKEN__;
  },
}));

function _decode(token: string) {
  const data = jwtDecode(token);
  const res = schema.safeParse(data);
  return res.success ? res.data.payload : null;
}
