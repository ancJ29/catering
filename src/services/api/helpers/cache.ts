import cache from "@/services/cache";
import logger from "@/services/logger";

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

export function _checkCache<R>(
  action: string,
  params: unknown,
  forceReload?: boolean,
) {
  const key = _key(action, params);
  logger.trace("[api-v2-cache]", key, { action, params });
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
