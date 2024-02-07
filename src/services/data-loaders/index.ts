import { Actions } from "@/auto-generated/api-configs";
import callApi from "@/services/api";
import { GenericObject } from "@/types";

type Req = { take: number; cursor: string };
type Res<T> = {
  [key: string]: T[];
} & { hasMore: boolean; cursor: string };

export async function loadAll<T>({
  key,
  action,
  cursor,
  noCache,
  take = 100,
  params,
}: {
  params?: GenericObject;
  noCache?: boolean;
  cursor?: string;
  key: string;
  take?: number;
  action: Actions;
}): Promise<T[]> {
  const res = await callApi<Req, Res<T>>({
    action,
    params: {
      ...params,
      take,
      cursor: cursor || "",
    },
    options: { noCache },
  });

  let remains: T[] = [];

  if (res?.hasMore) {
    remains = await loadAll({
      key,
      action,
      params,
      take,
      cursor: res.cursor,
      noCache,
    });
  }

  if (res && key in res) {
    return (res[key] || []).concat(remains);
  }

  return remains;
}
