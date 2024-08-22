import * as z from "zod"
import { templateTypeEnum } from "./enums";

export const templateSchema = z.object({
  id: z.string(),
  clientId: z.number().int(),
  type: templateTypeEnum,
  name: z.string(),
  version: z.number().int(),
  subject: z.string(),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastModifiedBy: z.string().nullish(),
})
