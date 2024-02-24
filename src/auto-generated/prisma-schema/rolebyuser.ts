import * as z from "zod"

export const roleByUserSchema = z.object({
  id: z.string(),
  userId: z.string(),
  roleId: z.string(),
  enabled: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastModifiedBy: z.string().nullish(),
})
