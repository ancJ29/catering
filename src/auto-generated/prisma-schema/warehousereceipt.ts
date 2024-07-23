import * as z from "zod"

// Helper schema for JSON fields
type Literal = boolean | number | string | null
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const warehouseReceiptSchema = z.object({
  id: z.string(),
  code: z.string(),
  others: jsonSchema,
  date: z.date(),
  departmentId: z.string(),
  clientId: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastModifiedBy: z.string().nullish(),
})
