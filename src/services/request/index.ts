import { GenericObject } from "@/types";
import { decode, md5 } from "@/utils";
import axios from "axios";
import { v4 as uuid } from "uuid";
import logger from "../logger";

export default async function request(
  data: GenericObject,
  token?: string,
) {
  const timestamp = Date.now();
  const requestId = uuid();
  const action = (data.action || "").toString();
  const nonce = await _nonce(timestamp, action, requestId);
  logger.debug(`[request] [${timestamp}] [${nonce}]`);
  return axios
    .request({
      method: "POST",
      url: import.meta.env.BASE_URL,
      data,
      headers: {
        "Authorization": token ? `Bearer ${token}` : undefined,
        "x-client-id": import.meta.env.CLIENT_ID || "0",
        "x-client-nonce": nonce,
        "x-client-timestamp": timestamp,
        "x-client-request-id": requestId,
      },
    })
    .then((res) => decode(res.data));
}

async function _nonce(
  timestamp: number,
  action: string,
  requestId: string,
  counter = 0,
) {
  if (counter > 10000) {
    throw new Error("Cannot generate nonce");
  }
  const nonce = Math.random().toString(36).substring(2, 12);
  const hash = await md5(
    `${timestamp}.${nonce}.${requestId}.${action}`,
  );
  if (hash.endsWith("00")) {
    return nonce;
  }
  return _nonce(timestamp, action, requestId, counter + 1);
}
