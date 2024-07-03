import * as z from "zod"

export const customerProductSchema = z.object({
  id: z.string(),
  enabled: z.boolean(),
  customerId: z.string(),
  productId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastModifiedBy: z.string().nullish(),
})
