import {
  ActionType,
  customerProductSchema,
  departmentSchema,
  menuSchema,
  monthlyInventorySchema,
  productSchema,
  templateSchema,
  unitSchema,
} from "@/auto-generated/prisma-schema";

import { z } from "zod";
import {
  xAddPurchaseCoordination,
  xAddPurchaseInternal,
  xAddPurchaseOrder,
  xAddPurchaseRequest,
  xAddWarehouseReceiptSchema,
  xCustomerSchema,
  xDailyMenuSchema,
  xDepartmentSchema,
  xInventorySchema,
  xMaterialSchema,
  xNotificationSchema,
  xProductSchema,
  xPurchaseCoordinationSchema,
  xPurchaseInternalSchema,
  xPurchaseOrderSchema,
  xPurchaseRequestSchema,
  xSupplierSchema,
  xUpdateInventorySchema,
  xUpdatePurchaseCoordination,
  xUpdatePurchaseInternal,
  xUpdatePurchaseOrder,
  xUpdatePurchaseRequest,
  xWarehouseReceiptSchema,
} from "./custom-prisma-schema";
import { ActionGroups, Actions, Policy, RequestDecorator } from "./enums";
import {
  bomOthersSchema,
  dailyMenuOthersSchema,
  departmentOthersSchema,
  inventoryOthersSchema,
  materialOthersSchema,
  piStatusSchema,
  poStatusSchema,
  prStatusSchema,
  supplierOthersSchema,
  userNotificationOthersSchema,
  userOthersSchema,
} from "./others";
import {
  addResponse,
  booleanSchema,
  dateSchema,
  emailSchema,
  getSchema,
  idAndNameSchema,
  listResponse,
  numberSchema,
  optionalBooleanSchema,
  optionalStringSchema,
  phoneSchema,
  stringSchema,
} from "./schema";

export type Schema = z.ZodType<unknown, z.ZodTypeDef, unknown>;

export type ActionConfig = {
  name: Actions;
  group: string;
  system?: boolean; // default false
  decorator?: RequestDecorator | RequestDecorator[];
  public?: boolean;
  type: ActionType;
  policy?: Policy | Policy[];
  schema: {
    request: Schema;
    response?: Schema;
  };
};

export const configs = {
  [Actions.LOGIN]: {
    name: Actions.LOGIN,
    group: ActionGroups.AUTHENTICATIONS,
    public: true,
    type: ActionType.READ,
    schema: {
      request: z.object({
        userName: stringSchema,
        password: stringSchema,
        remember: optionalBooleanSchema,
      }),
      response: z.object({
        token: stringSchema,
      }),
    },
  },
  [Actions.GET_VERSION]: {
    name: Actions.GET_VERSION,
    group: ActionGroups.METADATA,
    public: true,
    type: ActionType.READ,
    schema: {
      request: z.any(),
      response: z.object({
        version: stringSchema,
      }),
    },
  },
  [Actions.GET_METADATA]: {
    name: Actions.GET_METADATA,
    group: ActionGroups.METADATA,
    public: true,
    type: ActionType.READ,
    schema: {
      request: z.any(),
      response: z.object({
        version: stringSchema,
        materialGroupByType: z.record(stringSchema, stringSchema.array()),
        departments: idAndNameSchema.array(),
        roles: idAndNameSchema.array(),
        products: stringSchema.array().length(2).array(),
        materials: stringSchema.array().length(2).array(),
        units: unitSchema
          .pick({
            id: true,
            name: true,
            units: true,
            converters: true,
          })
          .array(),
        enums: idAndNameSchema
          .extend({
            targetTable: stringSchema.nullish(),
          })
          .array(),
        dictionaries: z.object({
          version: stringSchema,
          en: z.record(stringSchema),
          vi: z.record(stringSchema),
        }),
      }),
    },
  },
  [Actions.UPDATE_UNITS]: {
    name: Actions.UPDATE_UNITS,
    group: ActionGroups.METADATA,
    type: ActionType.WRITE,
    schema: {
      request: unitSchema
        .pick({
          name: true,
          units: true,
          converters: true,
        })
        .extend({
          id: optionalStringSchema,
        })
        .array(),
    },
  },
  [Actions.CHANGE_PASSWORD]: {
    name: Actions.CHANGE_PASSWORD,
    group: ActionGroups.PROFILE_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: z.object({
        currentPassword: stringSchema,
        password: stringSchema,
      }),
    },
  },
  [Actions.GET_USERS]: {
    name: Actions.GET_USERS,
    group: ActionGroups.USER_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: getSchema,
      response: listResponse.extend({
        users: z
          .object({
            id: stringSchema,
            phone: stringSchema.nullish(),
            email: stringSchema.nullish(),
            userName: stringSchema,
            fullName: stringSchema,
            active: booleanSchema,
            createdAt: z.date(),
            updatedAt: z.date(),
            others: userOthersSchema,
            lastModifiedBy: optionalStringSchema,
            departments: z
              .object({
                id: stringSchema,
                name: stringSchema,
              })
              .array(),
            roles: z
              .object({
                id: stringSchema,
                name: stringSchema,
              })
              .array(),
          })
          .array(),
      }),
    },
  },
  [Actions.ADD_USER]: {
    name: Actions.ADD_USER,
    group: ActionGroups.USER_MANAGEMENT,
    type: ActionType.WRITE,
    // policy: [
    //   Policy.SAME_CHAIN_IF_CHAIN_MANAGER,
    //   Policy.SAME_BRANCH_IF_BRANCH_MANAGER,
    // ],
    schema: {
      request: z.object({
        userName: stringSchema,
        fullName: stringSchema,
        password: stringSchema,
        email: emailSchema.optional(),
        phone: phoneSchema.optional(),
        departmentIds: stringSchema.array(),
      }),
      response: z.object({
        id: stringSchema,
        userName: stringSchema,
        fullName: stringSchema,
      }),
    },
  },
  [Actions.UPDATE_USER]: {
    name: Actions.UPDATE_USER,
    group: ActionGroups.USER_MANAGEMENT,
    type: ActionType.WRITE,
    // policy: [
    //   Policy.SAME_CHAIN_IF_CHAIN_MANAGER,
    //   Policy.SAME_BRANCH_IF_BRANCH_MANAGER,
    // ],
    schema: {
      request: z.object({
        id: stringSchema,
        userName: stringSchema,
        fullName: stringSchema,
        email: emailSchema.optional(),
        phone: phoneSchema.optional(),
      }),
    },
  },
  [Actions.DISABLE_USERS]: {
    name: Actions.DISABLE_USERS,
    group: ActionGroups.USER_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: z.object({
        ids: z.array(stringSchema),
      }),
    },
  },
  [Actions.GET_DEPARTMENTS]: {
    name: Actions.GET_DEPARTMENTS,
    group: ActionGroups.DEPARTMENT_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: getSchema,
      response: listResponse.extend({
        departments: xDepartmentSchema.array(),
      }),
    },
  },
  [Actions.ADD_DEPARTMENT]: {
    name: Actions.ADD_DEPARTMENT,
    group: ActionGroups.DEPARTMENT_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: departmentSchema
        .omit({
          id: true,
          clientId: true,
          createdAt: true,
          updatedAt: true,
          others: true,
        })
        .partial({
          code: true,
        })
        .extend({
          others: departmentOthersSchema,
        }),
      response: addResponse,
    },
  },
  [Actions.UPDATE_DEPARTMENT]: {
    name: Actions.UPDATE_DEPARTMENT,
    group: ActionGroups.DEPARTMENT_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: departmentSchema
        .omit({
          clientId: true,
          code: true,
          supId: true,
          others: true,
          createdAt: true,
          updatedAt: true,
        })
        .partial({
          name: true,
          type: true,
          shortName: true,
          phone: true,
          email: true,
          address: true,
          level: true,
        })
        .extend({
          others: departmentOthersSchema,
        }),
    },
  },
  [Actions.DELETE_DEPARTMENT]: {
    name: Actions.DELETE_DEPARTMENT,
    group: ActionGroups.DEPARTMENT_MANAGEMENT,
    type: ActionType.DELETE,
    schema: {
      request: z.object({
        id: stringSchema,
      }),
    },
  },
  [Actions.GET_CUSTOMERS]: {
    name: Actions.GET_CUSTOMERS,
    group: ActionGroups.CUSTOMER_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: getSchema,
      response: listResponse.extend({
        customers: xCustomerSchema.array(),
      }),
    },
  },
  [Actions.UPDATE_CUSTOMER]: {
    name: Actions.UPDATE_CUSTOMER,
    group: ActionGroups.CUSTOMER_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: xCustomerSchema.omit({
        createdAt: true,
        updatedAt: true,
        lastModifiedBy: true,
      }),
    },
  },
  [Actions.GET_CUSTOMER_PRODUCTS]: {
    name: Actions.GET_CUSTOMER_PRODUCTS,
    group: ActionGroups.CUSTOMER_PRODUCT_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: getSchema.extend({
        customerId: stringSchema,
      }),
      response: listResponse.extend({
        customerProducts: customerProductSchema.array(),
      }),
    },
  },
  [Actions.UPDATE_CUSTOMER_PRODUCT]: {
    name: Actions.UPDATE_CUSTOMER_PRODUCT,
    group: ActionGroups.CUSTOMER_PRODUCT_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: z
        .object({
          id: stringSchema,
          productId: stringSchema,
          customerId: stringSchema,
          enabled: booleanSchema,
        })
        .array(),
    },
  },
  [Actions.GET_PRODUCTS]: {
    name: Actions.GET_PRODUCTS,
    group: ActionGroups.PRODUCT_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: getSchema.extend({
        take: numberSchema.min(1).max(1000).optional().default(20),
      }),
      response: listResponse.extend({
        products: xProductSchema.array(),
      }),
    },
  },

  [Actions.GET_ALL_PRODUCTS]: {
    name: Actions.GET_ALL_PRODUCTS,
    group: ActionGroups.PRODUCT_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: z.object({}),
      response: xProductSchema
        .omit({
          clientId: true,
          createdAt: true,
        })
        .array(),
    },
  },
  [Actions.ADD_PRODUCT]: {
    name: Actions.ADD_PRODUCT,
    group: ActionGroups.PRODUCT_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: productSchema
        .omit({
          id: true,
          clientId: true,
          enabled: true,
          createdAt: true,
          updatedAt: true,
        })
        .partial({
          code: true,
        })
        .extend({
          categoryId: optionalStringSchema,
        }),
      response: addResponse,
    },
  },
  [Actions.GET_DAILY_MENU]: {
    name: Actions.GET_DAILY_MENU,
    group: ActionGroups.MENU_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: z.object({
        id: stringSchema.optional(),
        from: dateSchema,
        to: dateSchema,
        customerIds: stringSchema.array(),
      }),
      response: xDailyMenuSchema.array(),
    },
  },
  [Actions.GET_TODAY_MENU]: {
    name: Actions.GET_TODAY_MENU,
    group: ActionGroups.MENU_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: z.object({
        date: dateSchema.optional(),
      }),
      response: xDailyMenuSchema.array(),
    },
  },
  [Actions.PUSH_DAILY_MENU]: {
    name: Actions.PUSH_DAILY_MENU,
    group: ActionGroups.MENU_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: z.object({
        date: dateSchema,
        customerId: stringSchema,
        targetName: stringSchema,
        shift: stringSchema,
        price: numberSchema,
        quantity: z.record(stringSchema, numberSchema),
        estimatedQuantity: numberSchema,
        productionOrderQuantity: numberSchema,
        total: numberSchema,
        status: dailyMenuOthersSchema.shape.status,
        itemByType: z.record(stringSchema, numberSchema).optional(),
      }),
      response: addResponse,
    },
  },
  [Actions.GET_BOM]: {
    name: Actions.GET_BOM,
    group: ActionGroups.BOM_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: z.object({
        productId: stringSchema,
      }),
      response: z
        .object({
          id: stringSchema,
          productId: stringSchema,
          bom: z.record(stringSchema, numberSchema),
          others: bomOthersSchema,
        })
        .array(),
    },
  },
  [Actions.PUSH_BOM]: {
    name: Actions.PUSH_BOM,
    group: ActionGroups.BOM_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: z.object({
        id: optionalStringSchema,
        productId: stringSchema,
        bom: z.record(stringSchema, numberSchema),
        others: bomOthersSchema,
      }),
    },
  },
  [Actions.ADD_MENU]: {
    name: Actions.ADD_MENU,
    group: ActionGroups.MENU_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: menuSchema
        .omit({
          id: true,
          clientId: true,
          enabled: true,
          createdAt: true,
          updatedAt: true,
        })
        .partial({
          code: true,
        })
        .extend({
          productIds: stringSchema.array(),
        }),
      response: addResponse,
    },
  },
  [Actions.GET_ALL_MATERIALS]: {
    name: Actions.GET_ALL_MATERIALS,
    group: ActionGroups.MATERIAL_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: z.any({}),
      response: xMaterialSchema
        .extend({
          supplierMaterials: z
            .object({
              price: numberSchema.nonnegative(),
              supplier: z.object({
                id: stringSchema,
                name: stringSchema,
                others: supplierOthersSchema,
              }),
            })
            .array(),
        })
        .array(),
    },
  },
  [Actions.GET_MATERIALS]: {
    name: Actions.GET_MATERIALS,
    group: ActionGroups.MATERIAL_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: getSchema,
      response: listResponse.extend({
        materials: xMaterialSchema
          .extend({
            supplierMaterials: z
              .object({
                price: numberSchema.nonnegative(),
                supplier: z.object({
                  id: stringSchema,
                  name: stringSchema,
                  others: supplierOthersSchema,
                }),
              })
              .array(),
          })
          .array(),
      }),
    },
  },
  [Actions.PUSH_MATERIAL]: {
    name: Actions.PUSH_MATERIAL,
    group: ActionGroups.MATERIAL_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: xMaterialSchema
        .partial({
          id: true,
        })
        .omit({
          others: true,
          lastModifiedBy: true,
          clientId: true,
          createdAt: true,
          updatedAt: true,
          code: true,
        })
        .extend({
          others: materialOthersSchema,
        }),
      response: addResponse,
    },
  },
  [Actions.UPDATE_MATERIAL_SUPPLIER]: {
    name: Actions.UPDATE_MATERIAL_SUPPLIER,
    group: ActionGroups.MATERIAL_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: z.object({
        materialId: stringSchema,
        suppliers: z
          .object({
            supplierId: stringSchema,
            price: numberSchema.nonnegative(),
            active: booleanSchema,
          })
          .array(),
      }),
    },
  },
  [Actions.GET_INVENTORY]: {
    name: Actions.GET_INVENTORY,
    group: ActionGroups.INVENTORY_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: getSchema.extend({
        materialId: optionalStringSchema,
        departmentId: optionalStringSchema,
      }),
      response: listResponse.extend({
        inventories: xInventorySchema.array(),
      }),
    },
  },
  [Actions.UPDATE_INVENTORY]: {
    name: Actions.UPDATE_INVENTORY,
    group: ActionGroups.INVENTORY_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: z
        .object({
          id: optionalStringSchema,
          materialId: stringSchema,
          departmentId: stringSchema,
          amount: numberSchema,
          minimumAmount: numberSchema,
          others: inventoryOthersSchema,
        })
        .array(),
    },
  },
  [Actions.ADD_TO_INVENTORY]: {
    name: Actions.ADD_TO_INVENTORY,
    group: ActionGroups.INVENTORY_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: xUpdateInventorySchema.array(),
    },
  },
  [Actions.REMOVE_FROM_INVENTORY]: {
    name: Actions.REMOVE_FROM_INVENTORY,
    group: ActionGroups.INVENTORY_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: xUpdateInventorySchema.array(),
    },
  },
  [Actions.GET_LOW_INVENTORIES]: {
    name: Actions.GET_LOW_INVENTORIES,
    group: ActionGroups.INVENTORY_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: getSchema.extend({
        departmentId: stringSchema,
      }),
      response: listResponse.extend({
        inventories: xInventorySchema.array(),
      }),
    },
  },
  [Actions.GET_PERIODIC_INVENTORIES]: {
    name: Actions.GET_PERIODIC_INVENTORIES,
    group: ActionGroups.INVENTORY_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: getSchema.extend({
        departmentId: stringSchema,
      }),
      response: listResponse.extend({
        inventories: xInventorySchema.array(),
      }),
    },
  },
  [Actions.GET_INVENTORIES_FOR_DAILY_MENU]: {
    name: Actions.GET_INVENTORIES_FOR_DAILY_MENU,
    group: ActionGroups.INVENTORY_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: getSchema.extend({
        departmentId: stringSchema,
      }),
      response: listResponse.extend({
        inventories: xInventorySchema.array(),
      }),
    },
  },
  [Actions.GET_MATERIAL_INVENTORIES]: {
    name: Actions.GET_MATERIAL_INVENTORIES,
    group: ActionGroups.INVENTORY_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: getSchema.extend({
        materialIds: stringSchema.array(),
      }),
      response: listResponse.extend({
        inventories: xInventorySchema.array(),
      }),
    },
  },
  [Actions.GET_MONTHLY_INVENTORIES]: {
    name: Actions.GET_MONTHLY_INVENTORIES,
    group: ActionGroups.MONTHLY_INVENTORY_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: getSchema.extend({
        date: dateSchema,
      }),
      response: listResponse.extend({
        monthlyInventories: monthlyInventorySchema.array(),
      }),
    },
  },
  [Actions.GET_SUPPLIERS]: {
    name: Actions.GET_SUPPLIERS,
    group: ActionGroups.SUPPLIER_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: getSchema.extend({
        take: numberSchema.min(1).max(300).optional().default(20),
      }),
      response: listResponse.extend({
        suppliers: xSupplierSchema
          .extend({
            supplierMaterials: z
              .object({
                price: numberSchema.nonnegative(),
                material: z.object({
                  id: stringSchema,
                  name: stringSchema,
                }),
              })
              .array(),
          })
          .array(),
      }),
    },
  },
  [Actions.ADD_SUPPLIER]: {
    name: Actions.ADD_SUPPLIER,
    group: ActionGroups.SUPPLIER_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: xSupplierSchema
        .omit({
          id: true,
          clientId: true,
          createdAt: true,
          updatedAt: true,
          lastModifiedBy: true,
        })
        .partial({
          code: true,
        })
        .refine((v) => {
          v.others.email = v.others.email?.trim();
          v.others.phone = v.others.phone?.trim();
          v.others.address = v.others.address?.trim();
          return v;
        }),
      response: addResponse,
    },
  },
  [Actions.UPDATE_SUPPLIER]: {
    name: Actions.UPDATE_SUPPLIER,
    group: ActionGroups.SUPPLIER_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: xSupplierSchema.omit({
        clientId: true,
        createdAt: true,
        updatedAt: true,
        lastModifiedBy: true,
      }),
    },
  },
  [Actions.UPDATE_SUPPLIER_MATERIAL]: {
    name: Actions.UPDATE_SUPPLIER_MATERIAL,
    group: ActionGroups.SUPPLIER_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: z.object({
        supplierId: stringSchema,
        materials: z
          .object({
            materialId: stringSchema,
            price: numberSchema.nonnegative(),
          })
          .array(),
      }),
    },
  },
  [Actions.GET_PURCHASE_REQUESTS]: {
    name: Actions.GET_PURCHASE_REQUESTS,
    group: ActionGroups.PURCHASE_REQUEST_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: getSchema.extend({
        from: dateSchema.optional(),
        to: dateSchema.optional(),
        status: prStatusSchema.optional(),
      }),
      response: listResponse.extend({
        purchaseRequests: xPurchaseRequestSchema.array(),
      }),
    },
  },
  [Actions.ADD_PURCHASE_REQUEST]: {
    name: Actions.ADD_PURCHASE_REQUEST,
    group: ActionGroups.PURCHASE_REQUEST_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: xAddPurchaseRequest,
      response: z.object({
        id: stringSchema,
      }),
    },
  },
  [Actions.UPDATE_PURCHASE_REQUEST]: {
    name: Actions.UPDATE_PURCHASE_REQUEST,
    group: ActionGroups.PURCHASE_REQUEST_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: xUpdatePurchaseRequest,
    },
  },
  [Actions.GET_PURCHASE_INTERNALS]: {
    name: Actions.GET_PURCHASE_INTERNALS,
    group: ActionGroups.PURCHASE_INTERNAL_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: getSchema.extend({
        from: dateSchema.optional(),
        to: dateSchema.optional(),
        receivingCateringId: optionalStringSchema,
        deliveryCateringId: optionalStringSchema,
        statuses: piStatusSchema.array().optional(),
      }),
      response: listResponse.extend({
        purchaseInternals: xPurchaseInternalSchema.array(),
      }),
    },
  },
  [Actions.ADD_PURCHASE_INTERNAL]: {
    name: Actions.ADD_PURCHASE_INTERNAL,
    group: ActionGroups.PURCHASE_INTERNAL_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: xAddPurchaseInternal.array(),
    },
  },
  [Actions.UPDATE_PURCHASE_INTERNAL_STATUS]: {
    name: Actions.UPDATE_PURCHASE_INTERNAL_STATUS,
    group: ActionGroups.PURCHASE_INTERNAL_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: z.object({
        id: stringSchema,
        status: stringSchema,
      }),
    },
  },
  [Actions.UPDATE_PURCHASE_INTERNAL]: {
    name: Actions.UPDATE_PURCHASE_INTERNAL,
    group: ActionGroups.PURCHASE_INTERNAL_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: xUpdatePurchaseInternal,
    },
  },
  [Actions.GET_PURCHASE_COORDINATIONS]: {
    name: Actions.GET_PURCHASE_COORDINATIONS,
    group: ActionGroups.PURCHASE_COORDINATION_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: getSchema.extend({
        from: dateSchema.optional(),
        to: dateSchema.optional(),
      }),
      response: listResponse.extend({
        purchaseCoordinations: xPurchaseCoordinationSchema.array(),
      }),
    },
  },
  [Actions.ADD_PURCHASE_COORDINATION]: {
    name: Actions.ADD_PURCHASE_COORDINATION,
    group: ActionGroups.PURCHASE_COORDINATION_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: xAddPurchaseCoordination.array(),
    },
  },
  [Actions.UPDATE_PURCHASE_COORDINATION]: {
    name: Actions.UPDATE_PURCHASE_COORDINATION,
    group: ActionGroups.PURCHASE_COORDINATION_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: xUpdatePurchaseCoordination,
    },
  },
  [Actions.GET_PURCHASE_ORDERS]: {
    name: Actions.GET_PURCHASE_ORDERS,
    group: ActionGroups.PURCHASE_ORDER_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: getSchema.extend({
        from: dateSchema.optional(),
        to: dateSchema.optional(),
        statuses: poStatusSchema.array().optional(),
        excludeStatuses: poStatusSchema.array().optional(),
      }),
      response: listResponse.extend({
        purchaseOrders: xPurchaseOrderSchema.array(),
      }),
    },
  },
  [Actions.ADD_PURCHASE_ORDER]: {
    name: Actions.ADD_PURCHASE_ORDER,
    group: ActionGroups.PURCHASE_ORDER_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: xAddPurchaseOrder.array(),
    },
  },
  [Actions.UPDATE_PURCHASE_ORDER_STATUS]: {
    name: Actions.UPDATE_PURCHASE_ORDER_STATUS,
    group: ActionGroups.PURCHASE_ORDER_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: z.object({
        id: stringSchema,
        status: stringSchema,
      }),
    },
  },
  [Actions.SEND_PURCHASE_ORDER_TO_SUPPLIER]: {
    name: Actions.SEND_PURCHASE_ORDER_TO_SUPPLIER,
    group: ActionGroups.PURCHASE_ORDER_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: z.object({
        id: stringSchema,
        email: stringSchema,
      }),
    },
  },
  [Actions.UPDATE_PURCHASE_ORDER]: {
    name: Actions.UPDATE_PURCHASE_ORDER,
    group: ActionGroups.PURCHASE_ORDER_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: xUpdatePurchaseOrder,
    },
  },
  [Actions.GET_WAREHOUSE_RECEIPTS]: {
    name: Actions.GET_WAREHOUSE_RECEIPTS,
    group: ActionGroups.WAREHOUSE_RECEIPT_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: getSchema.extend({
        from: dateSchema.optional(),
        to: dateSchema.optional(),
      }),
      response: listResponse.extend({
        warehouseReceipts: xWarehouseReceiptSchema.array(),
      }),
    },
  },
  [Actions.GET_WAREHOUSE_EXPORTS]: {
    name: Actions.GET_WAREHOUSE_EXPORTS,
    group: ActionGroups.WAREHOUSE_RECEIPT_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: getSchema.extend({
        from: dateSchema.optional(),
        to: dateSchema.optional(),
      }),
      response: listResponse.extend({
        warehouseReceipts: xWarehouseReceiptSchema.array(),
      }),
    },
  },
  [Actions.GET_WAREHOUSE_IMPORTS]: {
    name: Actions.GET_WAREHOUSE_IMPORTS,
    group: ActionGroups.WAREHOUSE_RECEIPT_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: getSchema.extend({
        from: dateSchema.optional(),
        to: dateSchema.optional(),
      }),
      response: listResponse.extend({
        warehouseReceipts: xWarehouseReceiptSchema.array(),
      }),
    },
  },
  [Actions.ADD_WAREHOUSE_RECEIPT]: {
    name: Actions.ADD_WAREHOUSE_RECEIPT,
    group: ActionGroups.WAREHOUSE_RECEIPT_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: xAddWarehouseReceiptSchema,
    },
  },
  [Actions.GET_CATERING_DASHBOARD]: {
    name: Actions.GET_CATERING_DASHBOARD,
    group: ActionGroups.DASHBOARD_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: z.object({
        customerIds: stringSchema.array(),
      }),
      response: z.object({
        shiftService: numberSchema,
        mealCount: numberSchema,
        revenue: numberSchema,
        cost: numberSchema,
        externalWarehouseEntry: numberSchema,
        internalWarehouseEntry: numberSchema,
        warehouseUsageOrder: numberSchema,
        inventoryCheckInOrder: numberSchema,
        inventoryCheckOutOrder: numberSchema,
        purchaseRequest: numberSchema,
      }),
    },
  },
  [Actions.GET_OWNER_DASHBOARD]: {
    name: Actions.GET_OWNER_DASHBOARD,
    group: ActionGroups.DASHBOARD_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: z.any(),
      response: z.object({
        pendingConfirmation: numberSchema,
        dispatchCase: numberSchema,
        purchaseCase: numberSchema,
        poToBeProcessed: numberSchema,
        cateringHasNotOrdered: numberSchema,
        cateringHasOrderedForTomorrow: numberSchema,
        cateringHasNotStocked: numberSchema,
        cateringHasNotConductedInventory: numberSchema,
        shiftServices: numberSchema,
        enableCaterings: numberSchema,
        users: numberSchema,
        caterings: numberSchema,
        customers: numberSchema,
        suppliers: numberSchema,
      }),
    },
  },
  [Actions.GET_NOTIFICATIONS]: {
    name: Actions.GET_NOTIFICATIONS,
    group: ActionGroups.NOTIFICATION_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: getSchema.extend({
        from: dateSchema.optional(),
        to: dateSchema.optional(),
      }),
      response: listResponse.extend({
        notifications: xNotificationSchema.array(),
      }),
    },
  },
  [Actions.ADD_NOTIFICATION]: {
    name: Actions.ADD_NOTIFICATION,
    group: ActionGroups.NOTIFICATION_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: z.object({
        content: stringSchema,
        userIds: stringSchema.array(),
      }),
    },
  },
  [Actions.UPDATE_NOTIFICATION]: {
    name: Actions.UPDATE_NOTIFICATION,
    group: ActionGroups.NOTIFICATION_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: z
        .object({
          id: stringSchema,
          others: userNotificationOthersSchema,
        })
        .array(),
    },
  },
  [Actions.GET_TEMPLATES]: {
    name: Actions.GET_TEMPLATES,
    group: ActionGroups.TEMPLATE_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: getSchema,
      response: listResponse.extend({
        templates: templateSchema.array(),
      }),
    },
  },
} satisfies Record<Actions, ActionConfig>;
