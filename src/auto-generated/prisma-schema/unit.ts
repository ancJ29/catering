import * as z from "zod"

export const unitSchema = z.object({
  id: z.string(),
  clientId: z.number().int(),
  name: z.string(),
  units: z.string().array(),
  converters: z.number().int().array(),
  allowFloat: z.boolean().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastModifiedBy: z.string().nullish(),
})
