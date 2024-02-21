import * as z from "zod";

export const supplierSchema = z.object({
  id: z.string(),
  clientId: z.number().int(),
  isPerson: z.boolean(),
  code: z.string(),
  type: z.string().nullish(),
  contactId: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
