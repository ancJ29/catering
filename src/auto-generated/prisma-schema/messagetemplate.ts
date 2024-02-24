import * as z from "zod"
import { messageTypeEnum } from "./enums";

export const messageTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  description: z.string(),
  config: z.string().nullish(),
  template: z.string(),
  disabled: z.boolean(),
  type: messageTypeEnum,
  createdAt: z.date(),
  updatedAt: z.date(),
  lastModifiedBy: z.string().nullish(),
})
