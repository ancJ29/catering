import * as z from "zod"

export const monthlyInventorySchema = z.object({
  id: z.string(),
  clientId: z.number().int(),
  departmentId: z.string(),
  materialId: z.string(),
  amount: z.number(),
  date: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastModifiedBy: z.string().nullish(),
})
