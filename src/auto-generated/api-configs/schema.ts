import {
  branchSchema,
  chainSchema,
  clientEnumSchema,
  departmentSchema,
  userSchema,
} from "@/auto-generated/prisma-schema";
import { z } from "zod";

export const getSchema = z.object({
  cursor: z.string().optional(),
  take: z.number().min(1).max(100).optional().default(20),
});

export const addResponse = z.object({
  id: z.string(),
});

export const listResponse = z.object({
  cursor: z.string(),
});

export const successResponse = z.object({
  success: z.boolean(),
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
    branchIds: z.string().array(),
    chainIds: z.string().array(),
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
    branches: branchSchema
      .pick({
        id: true,
        name: true,
        shortName: true,
        address: true,
        chainId: true,
      })
      .array()
      .optional(),
    chains: chainSchema
      .pick({
        id: true,
        name: true,
      })
      .array()
      .optional(),
  });
