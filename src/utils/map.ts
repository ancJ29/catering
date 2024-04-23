import { GenericObject } from "@/types";

export function buildMap<T extends GenericObject>(
  data: T[],
  key = "id",
  value = "name",
): Map<string, string> {
  return new Map(
    data
      .map((item) => {
        if (
          typeof item[key] === "string" &&
          typeof item[value] === "string"
        ) {
          return [item[key], item[value]];
        }
      })
      .filter(Boolean) as [string, string][],
  );
}
