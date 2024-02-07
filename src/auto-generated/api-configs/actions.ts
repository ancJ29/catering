import {
  ActionType,
  customerSchema,
  departmentSchema,
  menuSchema,
  messageSchema,
  messageTemplateSchema,
  productSchema,
  reservationSchema,
  tableSchema,
} from "@/auto-generated/prisma-schema";
import { branchSchema } from "@/auto-generated/prisma-schema/branch";
import { chainSchema } from "@/auto-generated/prisma-schema/chain";
import {
  ReservationStatus,
  UserRole,
} from "@/auto-generated/prisma-schema/enums";
import { z } from "zod";
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
  futureDateSchema,
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
  [Actions.GET_CHAINS]: {
    name: Actions.GET_CHAINS,
    group: ActionGroups.CHAIN_MANAGEMENT,
    public: true,
    type: ActionType.READ,
    schema: {
      request: getSchema,
      response: listResponse.extend({
        chains: chainSchema
          .extend({
            totalBranches: z.number(),
          })
          .array(),
      }),
    },
  },
  [Actions.ADD_CHAIN]: {
    name: Actions.ADD_CHAIN,
    group: ActionGroups.CHAIN_MANAGEMENT,
    type: ActionType.WRITE,
    schema: {
      request: chainSchema
        .pick({
          name: true,
        })
        .required(),
      response: addResponse,
    },
  },
  [Actions.UPDATE_CHAIN]: {
    name: Actions.UPDATE_CHAIN,
    group: ActionGroups.CHAIN_MANAGEMENT,
    type: ActionType.WRITE,
    // policy: Policy.SAME_CHAIN,
    schema: {
      request: chainSchema
        .pick({
          id: true,
          name: true,
        })
        .required()
        .extend({
          chainId: z.string().optional(),
        })
        .transform((data) => {
          if (!data.chainId) {
            data.chainId = data.id;
          }
          return data;
        }),
    },
  },
  [Actions.DELETE_CHAIN]: {
    name: Actions.DELETE_CHAIN,
    group: ActionGroups.CHAIN_MANAGEMENT,
    type: ActionType.DELETE,
    schema: {
      request: z.object({
        id: z.string(),
      }),
    },
  },
  [Actions.GET_BRANCHES]: {
    name: Actions.GET_BRANCHES,
    group: ActionGroups.BRANCH_MANAGEMENT,
    public: true,
    type: ActionType.READ,
    schema: {
      request: getSchema.extend({
        chainId: z.string().optional(),
        name: z.string().optional(),
      }),
      response: listResponse.extend({
        branches: branchSchema.array(),
      }),
    },
  },
  [Actions.ADD_BRANCH]: {
    name: Actions.ADD_BRANCH,
    group: ActionGroups.BRANCH_MANAGEMENT,
    type: ActionType.WRITE,
    // policy: Policy.SAME_CHAIN,
    schema: {
      request: z
        .object({
          chainId: z.string(),
          name: z.string(),
          address: z.string(),
          shortName: z.string(),
        })
        .extend({
          email: emailSchema,
          phone: phoneSchema,
        }),
      response: addResponse,
    },
  },
  [Actions.UPDATE_BRANCH]: {
    name: Actions.UPDATE_BRANCH,
    group: ActionGroups.BRANCH_MANAGEMENT,
    type: ActionType.WRITE,
    // policy: Policy.SAME_BRANCH,
    schema: {
      request: z
        .object({
          id: z.string(),
          name: z.string(),
          address: z.string(),
          shortname: z.string(),
        })
        .extend({
          email: emailSchema,
          phone: phoneSchema,
          branchId: z.string().optional(),
        })
        .transform((data) => {
          if (!data.branchId) {
            data.branchId = data.id;
          }
          return data;
        }),
    },
  },
  [Actions.DELETE_BRANCH]: {
    name: Actions.DELETE_BRANCH,
    group: ActionGroups.BRANCH_MANAGEMENT,
    type: ActionType.DELETE,
    // policy: Policy.SAME_CHAIN,
    schema: {
      request: z.object({
        id: z.string(),
      }),
    },
  },
  [Actions.GET_TABLES]: {
    name: Actions.GET_TABLES,
    group: ActionGroups.BRANCH_MANAGEMENT,
    // policy: Policy.SAME_BRANCH,
    type: ActionType.READ,
    schema: {
      request: getSchema.extend({
        branchId: z.string(),
      }),
      response: listResponse.extend({
        tables: tableSchema.array(),
      }),
    },
  },
  [Actions.ADD_TABLES]: {
    name: Actions.ADD_TABLES,
    group: ActionGroups.BRANCH_MANAGEMENT,
    type: ActionType.WRITE,
    // policy: Policy.SAME_BRANCH,
    schema: {
      request: z.object({
        branchId: z.string(),
        tables: z.array(
          tableSchema
            .pick({
              name: true,
            })
            .required(),
        ),
      }),
    },
  },
  [Actions.UPDATE_TABLE]: {
    name: Actions.UPDATE_TABLE,
    group: ActionGroups.BRANCH_MANAGEMENT,
    type: ActionType.WRITE,
    // policy: Policy.SAME_BRANCH,
    schema: {
      request: tableSchema
        .pick({
          id: true,
          name: true,
        })
        .required(),
    },
  },
  [Actions.DELETE_TABLE]: {
    name: Actions.DELETE_TABLE,
    group: ActionGroups.BRANCH_MANAGEMENT,
    type: ActionType.WRITE,
    // policy: Policy.SAME_BRANCH,
    schema: {
      request: tableSchema
        .pick({
          id: true,
        })
        .required(),
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
  [Actions.GET_RESERVATIONS]: {
    name: Actions.GET_RESERVATIONS,
    group: ActionGroups.RESERVATION_MANAGEMENT,
    type: ActionType.READ,
    // policy: Policy.SAME_BRANCH,
    // decorator: RequestDecorator.ADD_BRANCH_IDS_AND_CHAIN_IDS,
    schema: {
      request: getSchema.extend({
        contactName: z.string().optional(),
        phone: z.string().optional(),
        departmentIds: z.string().array().optional(),
        statuses: z.nativeEnum(ReservationStatus).array().optional(),
        from: dateSchema.optional(),
        to: dateSchema.optional(),
      }),
      response: listResponse.extend({
        reservations: reservationSchema.array(),
      }),
    },
  },
  [Actions.ADD_RESERVATION]: {
    name: Actions.ADD_RESERVATION,
    group: ActionGroups.RESERVATION_MANAGEMENT,
    type: ActionType.WRITE,
    // policy: Policy.SAME_BRANCH,
    schema: {
      request: reservationSchema
        .pick({
          departmentId: true,
          contactName: true,
          note: true,
        })
        .extend({
          phone: phoneSchema,
          date: futureDateSchema.describe(
            "date must be greater than current time",
          ),
          adults: z.number().positive(),
          children: z.number().positive().optional(),
          status: z
            .nativeEnum(ReservationStatus)
            .refine((e) => e !== ReservationStatus.CANCELLED)
            .describe("Except Cancelled Status"),
        }),
    },
  },
  [Actions.ADD_RESERVATION_BY_END_USER]: {
    name: Actions.ADD_RESERVATION_BY_END_USER,
    group: ActionGroups.RESERVATION_MANAGEMENT,
    public: true,
    type: ActionType.WRITE,
    schema: {
      request: reservationSchema
        .pick({
          departmentId: true,
          contactName: true,
          note: true,
        })
        .extend({
          phone: phoneSchema,
          date: futureDateSchema.describe(
            "date must be greater than current time",
          ),
          adults: z.number().positive(),
          children: z.number().positive().optional(),
        }),
      response: z.object({
        reservationCode: z.string(),
        contactName: z.string(),
        departmentId: z.string(),
      }),
    },
  },
  [Actions.UPDATE_RESERVATION]: {
    name: Actions.UPDATE_RESERVATION,
    group: ActionGroups.RESERVATION_MANAGEMENT,
    type: ActionType.WRITE,
    // policy: Policy.SAME_BRANCH,
    schema: {
      request: reservationSchema
        .pick({
          departmentId: true,
          contactName: true,
          code: true,
        })
        .extend({
          note: z.string().optional(),
          date: futureDateSchema
            .describe("date must be greater than current time")
            .optional(),
          phone: z
            .string()
            .regex(/^(84\d{9}|842\d{10})$/)
            .optional(),
          adults: z.number().positive().optional(),
          children: z.number().positive().optional(),
          status: z
            .nativeEnum(ReservationStatus)
            .refine((e) => !e || e !== ReservationStatus.CANCELLED)
            .describe("Except Cancelled Status")
            .optional(),
        }),
    },
  },
  [Actions.CONFIRM_RESERVATION_BY_CODE]: {
    name: Actions.CONFIRM_RESERVATION_BY_CODE,
    group: ActionGroups.RESERVATION_MANAGEMENT,
    public: true,
    type: ActionType.WRITE,
    schema: {
      request: reservationSchema
        .pick({
          departmentId: true,
          code: true,
          contactName: true,
          note: true,
        })
        .extend({
          reservationCode: z.string(),
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
        role: z.nativeEnum(UserRole),
        branchIds: z.string().array(),
        chainIds: z.string().array(),
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
        departments: departmentSchema
          .omit({
            others: true,
          })
          .extend({
            others: z.unknown(),
          })
          .array(),
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
        customers: customerSchema
          .omit({
            others: true,
          })
          .extend({
            others: z.unknown(),
          })
          .array(),
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
} satisfies Record<Actions, ActionConfig>;
