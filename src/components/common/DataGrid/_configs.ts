import { GenericObject } from "@/types";

export type GenericObjectWithModificationInformation =
  GenericObject & {
    updatedAt?: Date | null;
    lastModifiedBy?: string | null;
  };

export const limitOptions = [5, 10, 20, 50, 100].map((el) => ({
  value: el,
  label: el.toString(),
}));
