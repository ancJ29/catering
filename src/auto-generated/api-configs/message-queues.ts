import { z } from "zod";
import { contextSchema } from "./general-schema";
import { genericSchema, numberSchema, stringSchema } from "./schema";

export enum MESSAGE_QUEUE_CHANNEL {
  PRODUCT_ADDED = "product-added",
  PRODUCT_UPDATED = "product-updated",
  DAILY_MENU_UPDATED = "daily-menu-updated",
  REQUEST_HANDLER_TRIGGER = "request-handler-trigger",
  OWNER_DASHBOARD_ADDED = "owner-dashboard-added",
}

export const messageQueueSchemaConfigs = {
  [MESSAGE_QUEUE_CHANNEL.PRODUCT_ADDED]: {
    schema: z.object({
      id: stringSchema,
    }),
  },
  [MESSAGE_QUEUE_CHANNEL.PRODUCT_UPDATED]: {
    schema: z.object({
      id: stringSchema,
    }),
  },
  [MESSAGE_QUEUE_CHANNEL.DAILY_MENU_UPDATED]: {
    schema: z.object({
      id: stringSchema,
      timestamp: numberSchema,
    }),
  },
  [MESSAGE_QUEUE_CHANNEL.REQUEST_HANDLER_TRIGGER]: {
    schema: contextSchema.extend({
      params: genericSchema
        .transform((v) => {
          // masking credentials
          if ("password" in v) {
            v.password = "********";
          }
          if ("currentPassword" in v) {
            v.currentPassword = "********";
          }
          return v;
        })
        .optional(),
    }),
  },
  [MESSAGE_QUEUE_CHANNEL.OWNER_DASHBOARD_ADDED]: {
    schema: z.object({
      id: stringSchema,
    }),
  },
} satisfies Record<MESSAGE_QUEUE_CHANNEL, { schema: z.AnyZodObject }>;
