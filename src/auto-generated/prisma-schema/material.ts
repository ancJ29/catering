import * as z from "zod";

// Helper schema for JSON fields
type Literal = boolean | number | string | null;
type Json = Literal | { [key: string]: Json } | Json[];
const literalSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
]);
const jsonSchema: z.ZodSchema<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]),
);

export const materialSchema = z.object({
  id: z.string(),
  clientId: z.number().int(),
  name: z.string(),
  code: z.string(),
  sku: z.string().nullish(),
  others: jsonSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  lastModifiedBy: z.string().nullish(),
});
