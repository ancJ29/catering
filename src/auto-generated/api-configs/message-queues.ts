import { z } from "zod";
import { contextSchema, genericSchema, stringSchema } from "./schema";

export enum MESSAGE_QUEUE_CHANNEL {
  PRODUCT_ADDED = "product-added",
  REQUEST_HANDLER_TRIGGER = "request-handler-trigger",
}

export const messageQueueSchemaConfigs = {
  [MESSAGE_QUEUE_CHANNEL.PRODUCT_ADDED]: {
    schema: z.object({
      id: stringSchema,
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
} satisfies Record<MESSAGE_QUEUE_CHANNEL, { schema: z.AnyZodObject }>;
