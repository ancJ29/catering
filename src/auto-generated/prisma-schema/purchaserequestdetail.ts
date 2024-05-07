import * as z from "zod"

export const purchaseRequestDetailSchema = z.object({
  id: z.string(),
  clientId: z.number().int(),
  amount: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastModifiedBy: z.string().nullish(),
  purchaseRequestId: z.string().nullish(),
  materialId: z.string().nullish(),
})
