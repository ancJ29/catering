import {
  customerSchema,
  dailyMenuSchema,
  departmentSchema,
  materialSchema,
} from "@/auto-generated/prisma-schema";
import { z } from "zod";
import {
  customerOthersSchema,
  dailyMenuOthersSchema,
  departmentOthersSchema,
  materialOthersSchema,
} from "./others-schema";

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

export const xMaterialSchema = materialSchema
  .omit({
    others: true,
  })
  .extend({
    others: materialOthersSchema,
  });

export const xDailyMenuSchema = dailyMenuSchema
  .omit({
    others: true,
  })
  .extend({
    others: dailyMenuOthersSchema,
    menu: z.object({
      menuProducts: z.array(
        z.object({
          product: z.object({
            id: z.string(),
            name: z.string(),
          }),
        }),
      ),
    }),
  });
