import useAuthStore from "@/stores/auth.store";
import axios, { type AxiosResponse } from "axios";
import { _parseDateToUnix, _parseUnixToDate } from "./time";
import { _validateResponse } from "./validate";

const base = import.meta.env.BASE_URL;

export async function _fetch<R>(action: string, params: unknown) {
  const token = useAuthStore.getState().token;
  const res = await axios<unknown, AxiosResponse<R>>({
    method: "POST",
    url: base,
    data: { action, params: _parseDateToUnix(params) },
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : undefined,
      "x-unix-timestamp": "true",
      "x-client-id": import.meta.env.CLIENT_ID || "0",
    },
  });
  return _validateResponse(action, _parseUnixToDate(res.data) as R);
}
