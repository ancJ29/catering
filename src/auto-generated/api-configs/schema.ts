import { z } from "zod";

export const unknownSchema = z.unknown();

export const booleanSchema = z.boolean();

export const stringSchema = z.string();

export const numberSchema = z.number();

export const optionalBooleanSchema = booleanSchema.optional();

export const optionalStringSchema = stringSchema.optional();

export const optionalNumberSchema = numberSchema.optional();

export const nullishStringSchema = stringSchema.nullish();

export const genericSchema = z.record(stringSchema, unknownSchema);

export const getSchema = z.object({
  id: optionalStringSchema,
  name: optionalStringSchema,
  cursor: optionalStringSchema,
  take: numberSchema.min(1).max(100).optional().default(20),
});

export const addResponse = z.object({
  id: stringSchema,
});

export const listResponse = z.object({
  cursor: optionalStringSchema,
  hasMore: optionalBooleanSchema,
});

export const successResponse = z.object({
  success: booleanSchema,
});

export const idAndNameSchema = z.object({
  id: stringSchema,
  name: stringSchema,
});

export const dateSchema = numberSchema
  .or(stringSchema)
  .or(z.date())
  .transform((val) => new Date(val));

export const futureDateSchema = dateSchema.refine(
  (val) => val.getTime() > Date.now(),
);

// 028-3933-9999 / 0912-345-678 → 842839339999
export const emailSchema = stringSchema.email();
export const phoneSchema = stringSchema.regex(/^(84\d{9}|842\d{10})$/);

export const notNullSchema = z.object({
  not: z.literal(null),
});
