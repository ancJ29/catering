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
  warehouseReceiptDetailSchema,
  warehouseReceiptSchema,
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
  warehouseReceiptDetailOthersSchema,
  warehouseReceiptOthersSchema,
} from "./others";
import { dateSchema, numberSchema, stringSchema } from "./schema";

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
  others: purchaseRequestOthersSchema.omit({ status: true }),
  purchaseRequestDetails: purchaseRequestDetailSchema
    .omit({
      id: true,
      others: true,
      purchaseRequestId: true,
      lastModifiedBy: true,
      createdAt: true,
      updatedAt: true,
    })
    .extend({
      others: purchaseRequestDetailOthersSchema,
    })
    .array(),
});

export const xUpdatePurchaseRequest = z.object({
  id: stringSchema,
  deliveryDate: dateSchema,
  departmentId: stringSchema,
  others: purchaseRequestOthersSchema,
  purchaseRequestDetails: purchaseRequestDetailSchema
    .omit({
      others: true,
      purchaseRequestId: true,
      lastModifiedBy: true,
      createdAt: true,
      updatedAt: true,
    })
    .extend({
      others: purchaseRequestDetailOthersSchema,
    })
    .array(),
  deletePurchaseRequestDetailIds: stringSchema.array(),
});

export const xAddPurchaseInternal = z.object({
  deliveryDate: dateSchema,
  purchaseRequestId: stringSchema,
  deliveryCateringId: stringSchema,
  others: purchaseInternalOthersSchema.omit({ status: true }),
  purchaseInternalDetails: purchaseInternalDetailSchema
    .omit({
      id: true,
      others: true,
      purchaseInternalId: true,
      lastModifiedBy: true,
      createdAt: true,
      updatedAt: true,
      actualAmount: true,
    })
    .extend({
      others: purchaseInternalDetailOthersSchema,
    })
    .array(),
});

export const xUpdatePurchaseInternal = z.object({
  id: stringSchema,
  deliveryDate: dateSchema,
  purchaseRequestId: stringSchema,
  deliveryCateringId: stringSchema,
  others: purchaseInternalOthersSchema,
  purchaseInternalDetails: purchaseInternalDetailSchema
    .omit({
      others: true,
      purchaseInternalId: true,
      lastModifiedBy: true,
      createdAt: true,
      updatedAt: true,
    })
    .extend({
      others: purchaseInternalDetailOthersSchema,
    })
    .array(),
});

export const xAddPurchaseCoordination = z.object({
  deliveryDate: dateSchema,
  purchaseRequestId: stringSchema,
  others: purchaseCoordinationOthersSchema.omit({ status: true }),
  purchaseCoordinationDetails: purchaseCoordinationDetailSchema
    .omit({
      id: true,
      others: true,
      purchaseCoordinationId: true,
      lastModifiedBy: true,
      createdAt: true,
      updatedAt: true,
    })
    .extend({
      others: purchaseCoordinationDetailOthersSchema,
    })
    .array(),
});

export const xUpdatePurchaseCoordination = z.object({
  id: stringSchema,
  deliveryDate: dateSchema,
  purchaseRequestId: stringSchema,
  others: purchaseCoordinationOthersSchema,
  purchaseCoordinationDetails: purchaseCoordinationDetailSchema
    .omit({
      others: true,
      purchaseCoordinationId: true,
      lastModifiedBy: true,
      createdAt: true,
      updatedAt: true,
    })
    .extend({
      others: purchaseCoordinationDetailOthersSchema,
    })
    .array(),
});

export const xAddPurchaseOrder = z.object({
  deliveryDate: dateSchema,
  supplierId: stringSchema,
  purchaseCoordinationId: stringSchema,
  others: purchaseOrderOthersSchema.omit({
    status: true,
    deliveryTimeStatus: true,
    serviceStatus: true,
  }),
  purchaseOrderDetails: purchaseOrderDetailSchema
    .omit({
      id: true,
      actualAmount: true,
      paymentAmount: true,
      others: true,
      purchaseOrderId: true,
      lastModifiedBy: true,
      createdAt: true,
      updatedAt: true,
    })
    .extend({
      others: purchaseOrderDetailOthersSchema,
    })
    .array(),
});

export const xUpdatePurchaseOrder = z.object({
  id: stringSchema,
  deliveryDate: dateSchema,
  supplierId: stringSchema,
  purchaseCoordinationId: stringSchema,
  others: purchaseOrderOthersSchema,
  purchaseOrderDetails: purchaseOrderDetailSchema
    .omit({
      others: true,
      purchaseOrderId: true,
      lastModifiedBy: true,
      createdAt: true,
      updatedAt: true,
    })
    .extend({
      others: purchaseOrderDetailOthersSchema,
    })
    .array(),
});

export const xPreferredSupplier = z.object({
  departmentId: stringSchema,
  materialId: stringSchema,
  supplierId: stringSchema,
  price: numberSchema,
});

export const xWarehouseReceiptSchema = warehouseReceiptSchema
  .omit({
    others: true,
  })
  .extend({
    others: warehouseReceiptOthersSchema,
    warehouseReceiptDetails: warehouseReceiptDetailSchema
      .omit({
        others: true,
      })
      .extend({
        others: warehouseReceiptDetailOthersSchema,
      })
      .array(),
  });

export const xAddWarehouseReceiptSchema = z.object({
  date: dateSchema,
  departmentId: stringSchema,
  others: warehouseReceiptOthersSchema,
  warehouseReceiptDetails: warehouseReceiptDetailSchema
    .omit({
      id: true,
      warehouseReceiptId: true,
      others: true,
      createdAt: true,
      updatedAt: true,
      lastModifiedBy: true,
    })
    .extend({
      others: warehouseReceiptDetailOthersSchema,
    })
    .array(),
});

export const xUpdateInventorySchema = z.object({
  materialId: stringSchema,
  departmentId: stringSchema,
  amount: numberSchema,
  expiryDate: dateSchema.optional(),
});
