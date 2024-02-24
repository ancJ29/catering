import * as z from "zod"

export const supplierMaterialSchema = z.object({
  id: z.string(),
  supplierId: z.string(),
  materialId: z.string(),
  price: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastModifiedBy: z.string().nullish(),
})
