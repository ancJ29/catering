import {
  actionStatusEnum,
  clientEnumSchema,
  departmentSchema,
  userSchema,
} from "@/auto-generated/prisma-schema";
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

const enumSchema = clientEnumSchema
  .pick({
    id: true,
    name: true,
  })
  .optional();

export const emailOrPhoneSchema = {
  email: emailSchema.optional(),
  phone: phoneSchema,
};

const baseMenuItem = z.object({
  key: stringSchema,
  label: stringSchema,
  icon: optionalStringSchema,
  url: optionalStringSchema,
  dashboard: stringSchema.array().optional(),
  roles: stringSchema.array().optional(),
});

type MenuItem = z.infer<typeof baseMenuItem> & {
  subs?: MenuItem[];
};

export const menuSchema: z.ZodType<MenuItem[]> = baseMenuItem
  .extend({
    subs: z.lazy(() => baseMenuItem.array().optional()),
  })
  .array();

export const payloadSchema = userSchema
  .pick({
    id: true,
    clientId: true,
    userName: true,
    fullName: true,
    role: true,
  })
  .extend({
    roles: stringSchema.array(),
    actionNames: stringSchema.array().optional(),
    departmentIds: stringSchema.array().optional(),
    clientRole: enumSchema.optional(),
    menu: menuSchema,
    dashboard: stringSchema.optional(),
    departments: departmentSchema
      .pick({
        id: true,
        name: true,
        shortName: true,
        level: true,
        type: true,
        supId: true,
      })
      .extend({
        type: enumSchema.optional(),
      })
      .array()
      .optional(),
  });

export const contextSchema = z.object({
  ctxId: stringSchema,
  clientId: optionalNumberSchema,
  ipAddress: optionalStringSchema,
  userAgent: optionalStringSchema,
  user: payloadSchema.optional(),
  source: z.union([z.literal("http"), z.literal("internal")]),
  isValidated: optionalBooleanSchema,
  action: stringSchema,
  params: genericSchema.optional(),
  status: actionStatusEnum.optional(),
});
