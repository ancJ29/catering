import { z } from "zod";
import { contextSchema } from "./schema";

export enum MESSAGE_QUEUE_CHANNEL {
  RESERVATION_ADDED = "reservation-added",
  REQUEST_HANDLER_TRIGGER = "request-handler-trigger",
}

export const messageQueueSchemaConfigs = {
  [MESSAGE_QUEUE_CHANNEL.RESERVATION_ADDED]: {
    schema: z.object({
      id: z.string(),
    }),
  },
  [MESSAGE_QUEUE_CHANNEL.REQUEST_HANDLER_TRIGGER]: {
    schema: contextSchema.extend({
      params: z
        .record(z.string(), z.unknown())
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
