import * as z from "zod"

// Helper schema for JSON fields
type Literal = boolean | number | string | null
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const purchaseInternalDetailSchema = z.object({
  id: z.string(),
  amount: z.number().int(),
  actualAmount: z.number().int(),
  others: jsonSchema,
  materialId: z.string(),
  lastModifiedBy: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  purchaseInternalId: z.string(),
})
