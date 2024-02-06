import * as z from "zod";

export const clientEnumSchema = z.object({
  id: z.string(),
  clientId: z.number().int(),
  name: z.string(),
  enabled: z.boolean(),
  code: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastModifiedBy: z.string().nullish(),
});
