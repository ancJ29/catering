import * as z from "zod";

export const roleSchema = z.object({
  id: z.string(),
  clientId: z.number().int(),
  name: z.string(),
  enabled: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastModifiedBy: z.string().nullish(),
});
