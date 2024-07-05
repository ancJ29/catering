import * as z from "zod"

export const mealSchema = z.object({
  id: z.string(),
  enabled: z.boolean(),
  name: z.string(),
  shift: z.string(),
  price: z.number(),
  customerId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastModifiedBy: z.string().nullish(),
})
