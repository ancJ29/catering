import * as z from "zod"

export const bomItemSchema = z.object({
  id: z.string(),
  bomId: z.string(),
  materialId: z.string(),
  amount: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastModifiedBy: z.string().nullish(),
})
