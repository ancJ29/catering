import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import { ActionType } from "@/auto-generated/prisma-schema";
import cache from "@/services/cache";
import logger from "@/services/logger";
import request from "@/services/request";
import useAuthStore from "@/stores/auth.store";
import { GenericObject } from "@/types";
import { _checkCache } from "./helpers/cache";
import { _parseDateToUnix, _parseUnixToDate } from "./helpers/time";
import {
  _validateParams,
  _validateResponse,
} from "./helpers/validate";
import loadingStore from "./store/loading";
import notificationStore from "./store/notification";

type callApiProps<T> = {
  params?: T;
  action: Actions;
  options?: {
    noCache?: boolean;
    noLoading?: boolean;
    forceReload?: boolean;
    toastMessage?: string;
    reloadOnSuccess?: boolean | { delay: number };
  };
};

const THRESHOLD = 800;

export default async function callApi<T, R>({
  params,
  action,
  options = {},
}: callApiProps<T>) {
  const _params = _validateParams<T>(action, params);
  let key = "";
  if (
    !options?.noCache &&
    actionConfigs[action].type === ActionType.READ
  ) {
    const cache = _checkCache<R>(
      action,
      _params,
      options?.forceReload,
    );
    key = cache.key;
    if (cache.data) {
      logger.trace("[api-v2-cache-hit]", key, action, _params);
      return cache.data;
    }
  }

  !options?.noLoading && loadingStore.startLoading();
  const start = Date.now();

  try {
    const data = await _fetch<R>(action, _params);
    logger.trace("[api-v2-success]", key, action, _params, data);
    key && cache.set(key, data as GenericObject);
    options.toastMessage && _toast(options.toastMessage);
    options.reloadOnSuccess && _reload(options.reloadOnSuccess);
    return data;
  } catch (error) {
    logger.error("[api-v2-error]", error);
    options.toastMessage && _toast("Unknown error!!!", true, true);
  } finally {
    const elapsed = Date.now() - start;
    !options?.noLoading &&
      loadingStore.stopLoading(Math.max(THRESHOLD - elapsed, 10));
    // TODO: elapsed > LIMIT && logger.warn("[api-v2-slow]", key, action, _params, elapsed);
  }
}

function _toast(message: string, error = false, translate = false) {
  notificationStore.push({
    color: error ? "red.5" : "blue.5",
    message: message,
    translate,
  });
}

function _reload(reloadOnSuccess: boolean | { delay: number }) {
  const timeout =
    typeof reloadOnSuccess !== "boolean"
      ? reloadOnSuccess.delay
      : 100;
  setTimeout(() => window.location.reload(), timeout);
}

async function _fetch<R>(action: string, params: unknown) {
  const token = useAuthStore.getState().token;
  const res = await request(
    { action, params: _parseDateToUnix(params) },
    token,
  );
  return _validateResponse(action, _parseUnixToDate(res) as R);
}
