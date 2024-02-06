import * as z from "zod";

export const categorySchema = z.object({
  id: z.string(),
  clientId: z.number().int(),
  name: z.string(),
  code: z.string(),
  description: z.string().nullish(),
  enabled: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastModifiedBy: z.string().nullish(),
});
