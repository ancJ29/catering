import { z } from "zod";
import { dateSchema } from "./schema";

export const departmentOthersSchema = z.object({
  iCenter: z.boolean().default(true),
  totalSupplier: z.number().default(0),
  lastInventoryDate: dateSchema.nullish(),
});

export const customerOthersSchema = z.object({
  cateringId: z.string(),
  cateringName: z.string(),
  type: z.enum(["company"]),
  targets: z
    .object({
      name: z.string(),
      shifts: z.string().array(),
    })
    .array(),
});
