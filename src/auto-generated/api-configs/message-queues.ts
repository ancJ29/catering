import { GenericObject } from "@/types";
import { z } from "zod";

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
    schema: z.object({
      userId: z.string().optional(),
      action: z.string(),
      params: z
        .record(z.string(), z.unknown())
        .transform((v: GenericObject) => {
          // masking credentials
          if ("password" in v) {
            v.password = "********";
          }
          return v;
        }),
    }),
  },
} satisfies Record<MESSAGE_QUEUE_CHANNEL, { schema: z.AnyZodObject }>;
