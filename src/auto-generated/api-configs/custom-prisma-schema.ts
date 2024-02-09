import {
  customerSchema,
  departmentSchema,
} from "@/auto-generated/prisma-schema";
import {
  customerOthersSchema,
  departmentOthersSchema,
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
