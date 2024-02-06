import {
  actionStatusEnum,
  clientEnumSchema,
  departmentSchema,
  userSchema,
} from "@/auto-generated/prisma-schema";
import { z } from "zod";

export const getSchema = z.object({
  cursor: z.string().optional(),
  take: z.number().min(1).max(300).optional().default(20),
});

export const addResponse = z.object({
  id: z.string(),
});

export const listResponse = z.object({
  cursor: z.string().optional(),
  hasMore: z.boolean().optional(),
});

export const successResponse = z.object({
  success: z.boolean(),
});

export const idAndNameSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const dateSchema = z
  .number()
  .or(z.date())
  .or(z.string())
  .transform((val) => new Date(val));

export const futureDateSchema = dateSchema.refine(
  (val) => val.getTime() > Date.now(),
);

// 028-3933-9999 / 0912-345-678 → 842839339999
export const emailSchema = z.string().email();
export const phoneSchema = z.string().regex(/^(84\d{9}|842\d{10})$/);

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

export const payloadSchema = userSchema
  .pick({
    id: true,
    clientId: true,
    userName: true,
    fullName: true,
    role: true,
  })
  .extend({
    actionNames: z.string().array().optional(),
    departmentIds: z.string().array().optional(),
    clientRole: enumSchema.optional(),
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
  ctxId: z.string(),
  clientId: z.number().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  user: payloadSchema.optional(),
  source: z.union([z.literal("http"), z.literal("internal")]),
  isValidated: z.boolean().optional(),
  action: z.string(),
  params: z.record(z.string(), z.unknown()).optional(),
  status: actionStatusEnum.optional(),
});

export const genericSchema = z.record(z.string(), z.unknown());
