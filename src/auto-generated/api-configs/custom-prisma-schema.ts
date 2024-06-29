import {
  bomSchema,
  customerSchema,
  dailyMenuSchema,
  departmentSchema,
  inventorySchema,
  materialSchema,
  productSchema,
  purchaseCoordinationDetailSchema,
  purchaseCoordinationSchema,
  purchaseInternalDetailSchema,
  purchaseInternalSchema,
  purchaseOrderDetailSchema,
  purchaseOrderSchema,
  purchaseRequestDetailSchema,
  purchaseRequestSchema,
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
  prStatusSchema,
  productOthersSchema,
  purchaseCoordinationDetailOthersSchema,
  purchaseCoordinationOthersSchema,
  purchaseInternalDetailOthersSchema,
  purchaseInternalOthersSchema,
  purchaseOrderDetailOthersSchema,
  purchaseOrderOthersSchema,
  purchaseRequestDetailOthersSchema,
  purchaseRequestOthersSchema,
  supplierOthersSchema,
  userOthersSchema,
} from "./others";
import {
  dateSchema,
  nullishStringSchema,
  numberSchema,
  stringSchema,
} from "./schema";

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
    supplierMaterials: z
      .object({
        price: numberSchema.nonnegative(),
        supplier: z.object({
          id: stringSchema,
          name: stringSchema,
        }),
      })
      .array(),
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

export const xPurchaseRequestSchema = purchaseRequestSchema
  .omit({
    others: true,
  })
  .extend({
    others: purchaseRequestOthersSchema,
    purchaseRequestDetails: purchaseRequestDetailSchema
      .omit({
        others: true,
      })
      .extend({
        others: purchaseRequestDetailOthersSchema,
      })
      .array(),
  });

export const xPurchaseInternalSchema = purchaseInternalSchema
  .omit({
    others: true,
  })
  .extend({
    others: purchaseInternalOthersSchema,
    purchaseInternalDetails: purchaseInternalDetailSchema
      .omit({
        others: true,
      })
      .extend({
        others: purchaseInternalDetailOthersSchema,
      })
      .array(),
  });

export const xPurchaseCoordinationSchema = purchaseCoordinationSchema
  .omit({
    others: true,
  })
  .extend({
    others: purchaseCoordinationOthersSchema.extend({
      purchaseRequestStatus: prStatusSchema,
    }),
    purchaseCoordinationDetails: purchaseCoordinationDetailSchema
      .omit({
        others: true,
      })
      .extend({
        others: purchaseCoordinationDetailOthersSchema,
      })
      .array(),
  });

export const xPurchaseOrderSchema = purchaseOrderSchema
  .omit({
    others: true,
  })
  .extend({
    others: purchaseOrderOthersSchema,
    purchaseOrderDetails: purchaseOrderDetailSchema
      .omit({
        others: true,
      })
      .extend({
        others: purchaseOrderDetailOthersSchema,
      })
      .array(),
  });

export const xAddPurchaseRequest = z.object({
  deliveryDate: dateSchema,
  departmentId: stringSchema,
  type: stringSchema,
  priority: stringSchema,
  purchaseRequestDetails: z
    .object({
      materialId: stringSchema,
      amount: numberSchema,
      price: numberSchema,
      supplierNote: nullishStringSchema,
      internalNote: nullishStringSchema,
    })
    .array(),
});

export const xUpdatePurchaseRequest = z.object({
  id: stringSchema,
  deliveryDate: dateSchema,
  departmentId: stringSchema,
  type: stringSchema,
  priority: stringSchema,
  status: stringSchema,
  purchaseRequestDetails: z
    .object({
      id: stringSchema,
      materialId: stringSchema,
      amount: numberSchema,
      price: numberSchema,
      supplierNote: nullishStringSchema,
      internalNote: nullishStringSchema,
    })
    .array(),
  deletePurchaseRequestDetailIds: stringSchema.array(),
});

export const xAddPurchaseInternal = z.object({
  deliveryDate: dateSchema,
  receivingCateringId: stringSchema,
  deliveryCateringId: stringSchema,
  purchaseRequestId: stringSchema,
  prCode: stringSchema,
  purchaseInternalDetails: z
    .object({
      amount: numberSchema,
      materialId: stringSchema,
      supplierNote: nullishStringSchema,
      internalNote: nullishStringSchema,
    })
    .array(),
});

export const xAddPurchaseCoordination = z.object({
  deliveryDate: dateSchema,
  purchaseRequestId: stringSchema,
  receivingCateringId: stringSchema,
  prCode: stringSchema,
  type: stringSchema,
  priority: stringSchema,
  createdById: stringSchema,
  createAt: dateSchema,
  approvedById: stringSchema,
  approvedAt: dateSchema,
  purchaseCoordinationDetails: z
    .object({
      price: numberSchema,
      amount: numberSchema,
      materialId: stringSchema,
      supplierNote: nullishStringSchema,
      internalNote: nullishStringSchema,
    })
    .array(),
});

export const xUpdatePurchaseCoordination = z.object({
  id: stringSchema,
  prCode: stringSchema,
  receivingCateringId: stringSchema,
  createdById: stringSchema,
  createAt: dateSchema,
  approvedById: stringSchema,
  approvedAt: dateSchema,
  deliveryDate: dateSchema,
  type: stringSchema,
  priority: stringSchema,
  status: stringSchema,
});

export const xAddPurchaseOrder = z.object({
  deliveryDate: dateSchema,
  supplierId: stringSchema,
  purchaseCoordinationId: stringSchema,
  prCode: stringSchema,
  type: stringSchema,
  priority: stringSchema,
  receivingCateringId: stringSchema,
  purchaseOrderDetails: z
    .object({
      materialId: stringSchema,
      amount: numberSchema,
      price: numberSchema,
      supplierNote: nullishStringSchema,
      internalNote: nullishStringSchema,
    })
    .array(),
});

export const xPreferredSupplier = z.object({
  departmentId: stringSchema,
  materialId: stringSchema,
  supplierId: stringSchema,
  price: numberSchema,
});
