import * as z from "zod"

export const mealDetailSchema = z.object({
  id: z.string(),
  mealId: z.string(),
  date: z.date(),
  predictedQuantity: z.number().int(),
  productionOrderQuantity: z.number().int(),
  employeeQuantity: z.number().int(),
  paymentQuantity: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastModifiedBy: z.string().nullish(),
})
