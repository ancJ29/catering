import {
  actionStatusEnum,
  clientEnumSchema,
  departmentSchema,
  userSchema,
} from "@/auto-generated/prisma-schema";
import { z } from "zod";
import { userOthersSchema } from "./others";
import {
  emailSchema,
  genericSchema,
  optionalBooleanSchema,
  optionalNumberSchema,
  optionalStringSchema,
  phoneSchema,
  stringSchema,
} from "./schema";

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
    others: userOthersSchema,
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
