import * as z from "zod"
import { messageStatusEnum } from "./enums";

export const messageSchema = z.object({
  id: z.string(),
  from: z.string().nullish(),
  destinations: z.string(),
  templateId: z.string(),
  params: z.string(),
  content: z.string(),
  status: messageStatusEnum,
  sendAfter: z.date().nullish(),
  sentAt: z.date().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastModifiedBy: z.string().nullish(),
})
