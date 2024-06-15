import * as z from "zod"

// Helper schema for JSON fields
type Literal = boolean | number | string | null
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const purchaseRequestSchema = z.object({
  id: z.string(),
  clientId: z.number().int(),
  deliveryDate: z.date(),
  code: z.string(),
  others: jsonSchema,
  createdById: z.string(),
  createdAt: z.date(),
  approvedById: z.string().nullish(),
  approvedAt: z.date().nullish(),
  updatedAt: z.date(),
  departmentId: z.string(),
  lastModifiedBy: z.string().nullish(),
})
