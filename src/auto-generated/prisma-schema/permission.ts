import * as z from "zod";

export const permissionSchema = z.object({
  id: z.string(),
  clientId: z.number().int().nullish(),
  name: z.string(),
  enabled: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastModifiedBy: z.string().nullish(),
});
