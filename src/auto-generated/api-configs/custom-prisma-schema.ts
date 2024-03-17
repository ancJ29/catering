import {
  bomSchema,
  customerSchema,
  dailyMenuSchema,
  departmentSchema,
  materialSchema,
  productSchema,
  supplierSchema,
  userSchema,
} from "@/auto-generated/prisma-schema";
import { z } from "zod";
import {
  bomOthersSchema,
  customerOthersSchema,
  dailyMenuOthersSchema,
  departmentOthersSchema,
  materialOthersSchema,
  productOthersSchema,
  supplierOthersSchema,
  userOthersSchema,
} from "./others";
import { stringSchema } from "./schema";

export const xUserSchema = userSchema
  .omit({
    others: true,
  })
  .extend({
    others: userOthersSchema,
  });

export const xCustomerSchema = customerSchema
  .omit({
    others: true,
  })
  .extend({
    others: customerOthersSchema,
  });

export const xDepartmentSchema = departmentSchema
  .omit({
    others: true,
  })
  .extend({
    others: departmentOthersSchema,
  });

export const xProductSchema = productSchema
  .omit({
    others: true,
  })
  .extend({
    others: productOthersSchema,
  });

export const xMaterialSchema = materialSchema
  .omit({
    others: true,
  })
  .extend({
    others: materialOthersSchema,
  });

export const xSupplierSchema = supplierSchema
  .omit({
    others: true,
  })
  .extend({
    others: supplierOthersSchema,
  });

export const xBomSchema = bomSchema
  .omit({
    others: true,
  })
  .extend({
    others: bomOthersSchema,
  });

export const xDailyMenuSchema = dailyMenuSchema
  .omit({
    others: true,
  })
  .extend({
    others: dailyMenuOthersSchema,
    menu: z
      .object({
        menuProducts: z.array(
          z.object({
            product: z.object({
              id: stringSchema,
              name: stringSchema,
            }),
          }),
        ),
      })
      .optional(),
  });
