import {
  configs as actionConfigs,
  Actions,
} from "@/auto-generated/api-configs";
import axios from "axios";
import { z } from "zod";

const { response } = actionConfigs[Actions.GET_METADATA].schema;
type Response = z.infer<typeof response>;

export async function getMetadata() {
  window.dispatchEvent(new Event("start-loading"));
  // prettier-ignore
  return axios.request<Response>({
    method: "POST",
    url: import.meta.env.BASE_URL,
    data: {
      action: Actions.GET_METADATA,
    },
    headers: {
      "Content-Type": "application/json",
      "x-client-id": import.meta.env.CLIENT_ID || "0",
    },
  }).then((res) => res.data).finally(() => {
    window.dispatchEvent(new Event("clear-loading"));
  });
}
