import * as z from "zod"
import { actionStatusEnum } from "./enums";

export const actionLogSchema = z.object({
  id: z.string(),
  userId: z.string().nullish(),
  actionId: z.string(),
  params: z.string(),
  status: actionStatusEnum,
  ipAddress: z.string(),
  userAgent: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastModifiedBy: z.string().nullish(),
})
