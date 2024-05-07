import {
  bomSchema,
  customerSchema,
  dailyMenuSchema,
  departmentSchema,
  inventorySchema,
  materialSchema,
  productSchema,
  purchaseOrderSchema,
  supplierSchema,
  userSchema,
} from "@/auto-generated/prisma-schema";
import { z } from "zod";
import {
  bomOthersSchema,
  customerOthersSchema,
  dailyMenuOthersSchema,
  departmentOthersSchema,
  inventoryOthersSchema,
  materialOthersSchema,
  productOthersSchema,
  purchaseOrderOthersSchema,
  supplierOthersSchema,
  userOthersSchema,
} from "./others";
import { numberSchema, stringSchema } from "./schema";

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

export const xInventorySchema = inventorySchema
  .omit({
    others: true,
  })
  .extend({
    others: inventoryOthersSchema,
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

export const xPurchaseOrderSchema = purchaseOrderSchema
  .omit({
    others: true,
    deliveryDate: true,
  })
  .extend({
    others: purchaseOrderOthersSchema,
    deliveryDate: numberSchema,
  });
