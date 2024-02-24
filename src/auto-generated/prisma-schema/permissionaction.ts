import * as z from "zod"

export const permissionActionSchema = z.object({
  id: z.string(),
  permissionId: z.string(),
  actionId: z.string(),
  enabled: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastModifiedBy: z.string().nullish(),
})
