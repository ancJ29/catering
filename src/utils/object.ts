export function generateMap<T extends Record<string, unknown>>(
  arr: T[],
  key = "id",
) {
  return arr.reduce((acc: Record<string, T>, item: T) => {
    if (key in item && typeof item[key] === "string") {
      acc[item[key] as string] = item;
    }
    return acc;
  }, {} as Record<string, T>);
}
