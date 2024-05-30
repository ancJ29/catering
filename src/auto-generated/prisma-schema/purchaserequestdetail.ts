import * as z from "zod"

export const purchaseRequestDetailSchema = z.object({
  id: z.string(),
  amount: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastModifiedBy: z.string().nullish(),
  purchaseRequestId: z.string(),
  materialId: z.string(),
})
