import * as z from "zod"
import { reportStatusEnum } from "./enums";

// Helper schema for JSON fields
type Literal = boolean | number | string | null
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const reportSchema = z.object({
  id: z.string(),
  key: z.string(),
  content: jsonSchema,
  version: z.number().int(),
  status: reportStatusEnum,
  clientId: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastModifiedBy: z.string().nullish(),
})
