import {
  ActionType,
  departmentSchema,
  menuSchema,
  messageSchema,
  messageTemplateSchema,
  productSchema,
} from "@/auto-generated/prisma-schema";
import { z } from "zod";
import {
  xCustomerSchema,
  xDailyMenuSchema,
  xDepartmentSchema,
  xMaterialSchema,
  xSupplierSchema,
} from "./custom-prisma-schema";
import {
  ActionGroups,
  Actions,
  Policy,
  RequestDecorator,
} from "./enums";
import {
  addResponse,
  dateSchema,
  emailSchema,
  getSchema,
  idAndNameSchema,
  listResponse,
  phoneSchema,
} from "./schema";

export type ActionConfig = {
  name: string;
  group: string;
  system?: boolean; // default false
  decorator?: RequestDecorator | RequestDecorator[];
  public?: boolean;
  type: ActionType;
  policy?: Policy | Policy[];
  schema: {
    request: z.ZodType<unknown, z.ZodTypeDef, unknown>;
    response?: z.ZodType<unknown, z.ZodTypeDef, unknown>;
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
        userName: z.string(),
        password: z.string(),
        remember: z.boolean().optional(),
      }),
      response: z.object({
        token: z.string(),
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
        departments: idAndNameSchema.array(),
        roles: idAndNameSchema.array(),
        enums: idAndNameSchema
          .extend({
            targetTable: z.string().nullish(),
          })
          .array(),
        dictionaries: z.object({
          version: z.string(),
          en: z.record(z.string(), z.string()),
          vi: z.record(z.string(), z.string()),
        }),
      }),
    },
  },
  [Actions.GET_MESSAGES]: {
    name: Actions.GET_MESSAGES,
    group: ActionGroups.MESSAGE_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: getSchema.extend({
        from: z.string().optional(),
        templateId: z.string().optional(),
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
          config: z.record(z.string(), z.string()),
        }),
    },
  },
  [Actions.DISABLE_MESSAGE_TEMPLATE]: {
    name: Actions.DISABLE_MESSAGE_TEMPLATE,
    group: ActionGroups.MESSAGE_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: z.object({
        code: z.string(),
      }),
    },
  },
  [Actions.ENABLE_MESSAGE_TEMPLATE]: {
    name: Actions.ENABLE_MESSAGE_TEMPLATE,
    group: ActionGroups.MESSAGE_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: z.object({
        code: z.string(),
      }),
    },
  },
  [Actions.CHANGE_PASSWORD]: {
    name: Actions.CHANGE_PASSWORD,
    group: ActionGroups.PROFILE_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: z.object({
        currentPassword: z.string(),
        password: z.string(),
      }),
    },
  },
  [Actions.GET_USERS]: {
    name: Actions.GET_USERS,
    group: ActionGroups.USER_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: getSchema.extend({
        name: z.string().optional(),
      }),
      response: listResponse.extend({
        users: z
          .object({
            id: z.string(),
            phone: z.string().nullish(),
            email: z.string().nullish(),
            userName: z.string(),
            fullName: z.string(),
            active: z.boolean(),
            createdAt: z.date(),
            updatedAt: z.date(),
            lastModifiedBy: z.string().optional(),
            departments: z
              .object({
                id: z.string(),
                name: z.string(),
              })
              .array(),
            roles: z
              .object({
                id: z.string(),
                name: z.string(),
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
        userName: z.string(),
        fullName: z.string(),
        password: z.string(),
        email: emailSchema.optional(),
        phone: phoneSchema.optional(),
        roleId: z.string(),
        departmentIds: z.string().array().default([]),
      }),
      response: z.object({
        id: z.string(),
        userName: z.string(),
        fullName: z.string(),
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
        id: z.string(),
        userName: z.string(),
        fullName: z.string(),
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
        ids: z.array(z.string()),
      }),
    },
  },
  [Actions.GET_DEPARTMENTS]: {
    name: Actions.GET_DEPARTMENTS,
    group: ActionGroups.DEPARTMENT_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: getSchema.extend({
        type: z.string().optional(),
        name: z.string().optional(),
      }),
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
        id: z.string(),
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
  [Actions.GET_PRODUCTS]: {
    name: Actions.GET_PRODUCTS,
    group: ActionGroups.PRODUCT_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: getSchema.extend({
        take: z.number().min(1).max(1000).optional().default(20),
        name: z.string().optional(),
      }),
      response: listResponse.extend({
        products: productSchema.array(),
      }),
    },
  },
  [Actions.ADD_PRODUCT]: {
    name: "add-product",
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
          categoryId: z.string().optional(),
        }),
      response: addResponse,
    },
  },
  [Actions.GET_DAILY_MENU]: {
    name: "get-daily-menu",
    group: ActionGroups.MENU_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: z.object({
        from: dateSchema,
        to: dateSchema,
        customerId: z.string(),
      }),
      response: xDailyMenuSchema.array(),
    },
  },
  [Actions.PUSH_DAILY_MENU]: {
    name: "push-daily-menu",
    group: ActionGroups.MENU_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: z.object({
        productIds: z.string().array(),
        date: dateSchema,
        customerId: z.string(),
        targetName: z.string(),
        shift: z.string(),
      }),
      response: addResponse,
    },
  },
  [Actions.ADD_MENU]: {
    name: "add-menu",
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
          productIds: z.string().array(),
        }),
      response: addResponse,
    },
  },
  [Actions.GET_MATERIALS]: {
    name: "get-materials",
    group: ActionGroups.MATERIAL_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: getSchema.extend({
        name: z.string().optional(),
      }),
      response: listResponse.extend({
        materials: xMaterialSchema.array(),
      }),
    },
  },
  [Actions.GET_SUPPLIERS]: {
    name: "get-suppliers",
    group: ActionGroups.SUPPLIER_MANAGEMENT,
    type: ActionType.READ,
    schema: {
      request: getSchema.extend({
        name: z.string().optional(),
      }),
      response: listResponse.extend({
        suppliers: xSupplierSchema
          .extend({
            supplierMaterials: z
              .object({
                price: z.number().nonnegative(),
                material: z.object({
                  id: z.string(),
                  name: z.string(),
                }),
              })
              .array(),
          })
          .array(),
      }),
    },
  },
  [Actions.ADD_SUPPLIER]: {
    name: "add-supplier",
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
        }),
      response: addResponse,
    },
  },
  [Actions.UPDATE_SUPPLIER]: {
    name: "update-supplier",
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
    name: "update-supplier-material",
    group: ActionGroups.SUPPLIER_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: z.object({
        supplierId: z.string(),
        materials: z
          .object({
            materialId: z.string(),
            price: z.number().nonnegative(),
          })
          .array(),
      }),
    },
  },
} satisfies Record<Actions, ActionConfig>;
