import * as z from "zod"

export const notificationSchema = z.object({
  id: z.string(),
  content: z.string(),
  clientId: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastModifiedBy: z.string().nullish(),
})
