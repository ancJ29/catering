import logger from "@/services/logger";
import { GenericObject } from "@/types";

export function positivePrice(value: string | number) {
  let price = parseInt(
    value.toString().replace(/\./g, "").replace(/,/g, "."),
  );
  if (isNaN(price) || price < 0) {
    price = 0;
  }
  return price;
}

export function removeHashFromUrl() {
  window.location.hash?.length &&
    window.history.pushState(
      "",
      document.title,
      window.location.pathname + window.location.search,
    );
}

export function addHashToUrl(hash: string) {
  hash.length && (window.location.hash = "#" + hash);
}

export function toCondition<T>(hash: string) {
  try {
    return JSON.parse(
      decodeURIComponent(window.atob(hash.slice(1))),
    ) as T;
  } catch (error) {
    logger.error("toCondition", error);
    return {} as T;
  }
}

export function toHash(condition: GenericObject) {
  const data = JSON.stringify(condition);
  if (!data || data === "{}") {
    removeHashFromUrl();
  } else {
    addHashToUrl(window.btoa(encodeURIComponent(data)));
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AsyncFunction = (...args: any[]) => Promise<any>;

export function throttle(fn: AsyncFunction, limit: number) {
  let active = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queue: any[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const execute = async (...args: any[]) => {
    if (active >= limit) {
      return new Promise((resolve) => {
        queue.push(() => resolve(execute(...args)));
      });
    }

    active++;
    const result = await fn(...args);
    active--;

    if (queue.length) {
      const next = queue.shift();
      next();
    }

    return result;
  };

  return execute;
}
