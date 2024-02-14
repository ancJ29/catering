import * as z from "zod";

export const clientSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  code: z.string(),
  enabled: z.boolean(),
  isSystem: z.boolean(),
  memo: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastModifiedBy: z.string().nullish(),
});
