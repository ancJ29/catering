import {
  ActionType,
  departmentSchema,
  menuSchema,
  messageSchema,
  messageTemplateSchema,
  productSchema,
  unitSchema,
} from "@/auto-generated/prisma-schema";
import { z } from "zod";
import {
  xCustomerSchema,
  xDailyMenuSchema,
  xDepartmentSchema,
  xMaterialSchema,
  xProductSchema,
  xSupplierSchema,
} from "./custom-prisma-schema";
import { ActionGroups, Actions, Policy, RequestDecorator } from "./enums";
import { dailyMenuOthersSchema, userOthersSchema } from "./others";
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

export type ActionConfig = {
  name: Actions;
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
        userName: stringSchema,
        password: stringSchema,
        remember: optionalBooleanSchema,
      }),
      response: z.object({
        token: stringSchema,
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
        materialGroupByType: z.record(stringSchema, stringSchema.array()),
        departments: idAndNameSchema.array(),
        roles: idAndNameSchema.array(),
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
        customerId: stringSchema,
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
        quantity: z.record(stringSchema, numberSchema),
        status: dailyMenuOthersSchema.shape.status,
      }),
      response: addResponse,
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
          })
          .array(),
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
          v.others.contact = v.others.contact?.trim();
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
} satisfies Record<Actions, ActionConfig>;
