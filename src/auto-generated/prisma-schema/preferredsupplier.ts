import * as z from "zod"

export const preferredSupplierSchema = z.object({
  id: z.string(),
  supplierMaterialId: z.string(),
  departmentId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastModifiedBy: z.string().nullish(),
})
