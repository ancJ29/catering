import { GenericObject } from "@/types";
import { decode, encode, md5 } from "@/utils";
import axios from "axios";
import { v4 as uuid } from "uuid";
import logger from "../logger";

export default async function request(
  data: GenericObject,
  token?: string,
) {
  const timestamp = Date.now();
  const requestId = uuid();
  data.timestamp = timestamp;
  const encoded = await encode(data);
  const nonce = await _nonce(timestamp, encoded, requestId);
  logger.debug(`[request] [${timestamp}] [${nonce}] 111`);
  return axios
    .request({
      method: "POST",
      url: import.meta.env.BASE_URL,
      data: {
        data: encoded,
      },
      headers: {
        "Authorization": token ? `Bearer ${token}` : undefined,
        "x-client-id": import.meta.env.CLIENT_ID || "0",
        "x-client-nonce": nonce,
        "x-client-timestamp": timestamp,
        "x-client-request-id": requestId,
        "x-debug-code": import.meta.env.DEBUG_CODE || undefined,
      },
    })
    .then(async (res) => {
      const json = await decode(res.data);
      logger.trace(
        `[response] [${timestamp}] [${nonce}]`,
        data,
        json,
      );
      return json;
    });
}

async function _nonce(
  timestamp: number,
  encoded: string,
  requestId: string,
  counter = 0,
): Promise<string> {
  if (counter > 10000) {
    throw new Error("Cannot generate nonce");
  }
  const nonce = Math.random().toString(36).substring(2, 12);
  const hash = await md5(
    `${timestamp}.${nonce}.${requestId}.${encoded}`,
  );
  if (hash.endsWith("00")) {
    return nonce;
  }
  return _nonce(timestamp, encoded, requestId, counter + 1);
}
