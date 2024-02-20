import { GenericObject, OptionProps } from "@/types";

export function cloneDeep<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function uniqueByKey<T, K extends keyof T>(
  arr: T[],
  key: string,
) {
  return [
    ...new Map(
      arr
        .filter((item) => item[key as K]) // skip invalid items
        .map((item) => [item[key as K], item]),
    ).values(),
  ];
}

export function sortByKey<T, K extends keyof T>(arr: T[], key: K) {
  return arr.sort((a, b) => {
    if (a[key] > b[key]) {
      return 1;
    }
    if (a[key] < b[key]) {
      return 1;
    }
    return 0;
  });
}

export function buildOptions<T extends GenericObject>(
  data: T[],
  keys: { value: string; label: string } = {
    value: "id",
    label: "name",
  },
): OptionProps[] {
  return data.map((item, idx) => ({
    value: (item[keys.value] || idx.toString()) as string,
    label: (item[keys.label] || "") as string,
  }));
}

export function getCursor<T extends Record<string, unknown>>(
  arr: T[],
  key = "id",
): string {
  if (!arr.length) {
    return "";
  }
  const last = arr[arr.length - 1];
  if (key in last && typeof last[key] === "string") {
    return (last[key] || "") as string;
  }
  return "";
}

export function isSubArray<T extends string | number>(
  parent: T[],
  children: T[],
) {
  const parentMap = new Map<T, number>();
  parent.forEach((item) => {
    parentMap.set(item, 1);
  });
  return children.some((item) => !parentMap.has(item));
}

export function unique<T>(arr: T[]) {
  return [...new Set(arr)];
}

export function lastElement<T>(arr: T[]) {
  return arr[arr.length - 1];
}
