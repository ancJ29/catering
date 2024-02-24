import { decode } from "@/utils";
import axios from "axios";

export default async function request(data: unknown, token?: string) {
  return axios
    .request({
      method: "POST",
      url: import.meta.env.BASE_URL,
      data,
      headers: {
        "Authorization": token ? `Bearer ${token}` : undefined,
        "x-client-id": import.meta.env.CLIENT_ID || "0",
      },
    })
    .then((res) => decode(res.data));
}
