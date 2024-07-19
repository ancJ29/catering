import {
  ActionType,
  customerProductSchema,
  departmentSchema,
  menuSchema,
  messageSchema,
  messageTemplateSchema,
  productSchema,
  unitSchema,
} from "@/auto-generated/prisma-schema";

import { z } from "zod";
import {
  xAddPurchaseCoordination,
  xAddPurchaseInternal,
  xAddPurchaseOrder,
  xAddPurchaseRequest,
  xCustomerSchema,
  xDailyMenuSchema,
  xDepartmentSchema,
  xInventorySchema,
  xMaterialSchema,
  xProductSchema,
  xPurchaseCoordinationSchema,
  xPurchaseInternalSchema,
  xPurchaseOrderSchema,
  xPurchaseRequestSchema,
  xSupplierSchema,
  xUpdatePurchaseCoordination,
  xUpdatePurchaseInternal,
  xUpdatePurchaseOrder,
  xUpdatePurchaseRequest,
} from "./custom-prisma-schema";
import { ActionGroups, Actions, Policy, RequestDecorator } from "./enums";
import {
  bomOthersSchema,
  dailyMenuOthersSchema,
  inventoryOthersSchema,
  poStatusSchema,
  prStatusSchema,
  supplierOthersSchema,
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
  [Actions.GET_MESSAGES]: {
    name: Actions.GET_MESSAGES,
    group: ActionGroups.MESSAGE_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: getSchema.extend({
        from: optionalStringSchema,
        templateId: optionalStringSchema,
      }),
      response: listResponse.extend({
        messages: messageSchema.array(),
      }),
    },
  },
  [Actions.GET_ALL_MESSAGE_TEMPLATES]: {
    name: Actions.GET_ALL_MESSAGE_TEMPLATES,
    group: ActionGroups.MESSAGE_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: z.object({}),
      response: messageTemplateSchema.array(),
    },
  },
  [Actions.ADD_MESSAGE_TEMPLATE]: {
    name: Actions.ADD_MESSAGE_TEMPLATE,
    group: ActionGroups.MESSAGE_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: messageTemplateSchema
        .pick({
          name: true,
          code: true,
          description: true,
          template: true,
          type: true,
        })
        .extend({
          config: z.record(stringSchema),
        }),
    },
  },
  [Actions.DISABLE_MESSAGE_TEMPLATE]: {
    name: Actions.DISABLE_MESSAGE_TEMPLATE,
    group: ActionGroups.MESSAGE_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: z.object({
        code: stringSchema,
      }),
    },
  },
  [Actions.ENABLE_MESSAGE_TEMPLATE]: {
    name: Actions.ENABLE_MESSAGE_TEMPLATE,
    group: ActionGroups.MESSAGE_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: z.object({
        code: stringSchema,
      }),
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
        .pick({
          id: true,
          name: true,
          code: true,
          sku: true,
          others: true,
        })
        .partial({
          id: true,
        }),
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
        departmentId: stringSchema,
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
        statuses: poStatusSchema.array(),
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
  [Actions.UPDATE_PURCHASE_ORDER]: {
    name: Actions.UPDATE_PURCHASE_ORDER,
    group: ActionGroups.PURCHASE_ORDER_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: xUpdatePurchaseOrder,
    },
  },
} satisfies Record<Actions, ActionConfig>;
