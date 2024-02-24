import * as z from "zod"

export const menuSchema = z.object({
  id: z.string(),
  clientId: z.number().int(),
  name: z.string().nullish(),
  code: z.string().nullish(),
  hash: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastModifiedBy: z.string().nullish(),
})
