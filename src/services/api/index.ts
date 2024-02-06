import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import { ActionType } from "@/auto-generated/prisma-schema";
import logger from "@/services/logger";
import useAuthStore from "@/stores/auth.store";
import axios, { type AxiosResponse } from "axios";
import dayjs from "dayjs";
import { LRUCache } from "lru-cache";
import { toast } from "react-toastify";
import { ZodTypeDef, z } from "zod";
import validator from "./_validator";

type GenericObject = {
  [key: string]: unknown;
};

type ActionConfig = {
  group: string;
  schema: {
    request: z.ZodType<unknown, ZodTypeDef, unknown>;
    response?: z.ZodType<unknown, ZodTypeDef, unknown>;
  };
};

type callApiProps<T> = {
  params?: T;
  action: Actions;
  options?: {
    noCache?: boolean;
    noLoading?: boolean;
    forceReload?: boolean;
    toastMessage?: string;
  };
};

const base = import.meta.env.BASE_URL;

const dateKeys = new Map<string, boolean>(
  Object.entries({
    createdAt: true,
    lastInventoryDate: true,
    updatedAt: true,
    date: true,
    from: true,
    to: true,
  }),
);

let counter = 0;

const cache = new LRUCache<string, GenericObject>({
  max: 100,
  maxSize: 1000,
  sizeCalculation: () => 1,
  ttl: 1000 * 60, // one minute
});

const shouldValidateParams = import.meta.env.DEV;
const shouldValidateResponse = import.meta.env.DEV;
function _validateParams<T>(action: string, params?: T) {
  if (!shouldValidateParams) {
    return params;
  }
  if (params) {
    const payload = useAuthStore.getState().user || undefined;
    const _params = params as Record<string, unknown>;
    return validator(payload, action, _params) as T;
  }
  return params;
}

function _validateResponse<R>(action: string, data: R): R {
  if (!shouldValidateResponse) {
    return data;
  }
  const actionConfig = actionConfigs[
    action as Actions
  ] as ActionConfig;
  if (actionConfig?.schema?.response) {
    const res = actionConfig.schema.response.safeParse(data);
    if (!res.success) {
      logger.error("[api-v2-invalid-response]", res.error);
      logger.error("[api-v2-invalid-response-data]", data);
      // alert(`Invalid response of ${action}`);
      throw new Error("Invalid response");
    } else {
      data = res.data as R;
    }
  }
  return data;
}

export default async function callApi<T, R>({
  params,
  action,
  options = {},
}: callApiProps<T>) {
  if (actionConfigs[action].type !== ActionType.READ) {
    options.noCache = true;
  }
  const _params = _validateParams<T>(action, params);
  let key = "";
  if (!options?.noCache) {
    const cache = _checkCache<R>(
      action,
      _params,
      options?.forceReload,
    );
    key = cache.key;
    if (cache.data) {
      logger.debug("[api-v2-cache-hit]", key, action, _params);
      return cache.data;
    }
  }
  !options?.noLoading && _increaseCounter();
  const start = Date.now();
  try {
    const data = await _fetch<R>(action, _params);
    options.toastMessage && toast(options.toastMessage);
    key && cache.set(key, data as GenericObject);
    logger.debug("[api-v2-success]", key, action, _params, data);
    return data;
  } catch (error) {
    // TODO: translate error message
    options?.toastMessage && toast("Unknown error");
    logger.error("[api-v2-error]", error);
  } finally {
    _decreaseCounter(start);
  }
  return undefined;
}

function _key<T>(action?: string, params?: T) {
  const ONE_MINUTE = 60000;
  const now = Date.now();
  return btoa(
    `${now - (now % ONE_MINUTE)}.${action}.${JSON.stringify(
      params || {},
    )}`,
  );
}

function _fromCache<R>(key: string) {
  if (cache.has(key)) {
    return cache.get(key) as R;
  }
  return undefined;
}

function _checkCache<R>(
  action: string,
  params: unknown,
  forceReload?: boolean,
) {
  const key = _key(action, params);
  logger.debug("[api-v2-cache]", key, { action, params });
  if (forceReload) {
    cache.delete(key);
    return { key };
  }
  const data = _fromCache<R>(key);
  if (data) {
    return { key, data };
  }
  return { key };
}

async function _decreaseCounter(start: number) {
  const THRESHOLD = 800;
  const delay = Math.max(THRESHOLD - (Date.now() - start), 0);
  if (delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  counter--;
  if (counter < 1) {
    window.dispatchEvent(new Event("clear-loading"));
  }
}

async function _increaseCounter() {
  counter < 1 && window.dispatchEvent(new Event("start-loading"));
  counter++;
}

async function _fetch<R>(action: string, params: unknown) {
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

function _isDateKey(key?: string) {
  return key && dateKeys.has(key);
}

function _parseUnixToDate(input: unknown, key?: string): unknown {
  if (typeof input === "number" && _isDateKey(key)) {
    return dayjs(input).toDate();
  } else if (Array.isArray(input)) {
    return input.map((item) => _parseUnixToDate(item, key));
  } else if (typeof input === "object" && input !== null) {
    return Object.fromEntries(
      Object.entries(
        input as { [s: string]: unknown } | ArrayLike<unknown>,
      ).map(([key, value]) => [key, _parseUnixToDate(value, key)]),
    );
  }
  return input;
}

function _parseDateToUnix(input: unknown, key?: string): unknown {
  if (dayjs.isDayjs(input)) {
    return input.unix() * 1e3;
  } else if (input instanceof Date) {
    return input.getTime();
  } else if (typeof input === "string" && _isDateKey(key)) {
    const date = new Date(input);
    if (date.toString() !== "Invalid Date") {
      return date.getTime();
    }
    return input;
  } else if (Array.isArray(input)) {
    return input.map((item) => _parseDateToUnix(item, key));
  } else if (typeof input === "object" && input !== null) {
    return Object.fromEntries(
      Object.entries(
        input as { [s: string]: unknown } | ArrayLike<unknown>,
      ).map(([key, value]) => [key, _parseDateToUnix(value)]),
    );
  }
  return input;
}
