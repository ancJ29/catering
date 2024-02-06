import * as z from "zod";

export const customerSchema = z.object({
  id: z.string(),
  clientId: z.number().int(),
  type: z.string().nullish(),
  code: z.string(),
  contactId: z.string().nullish(),
  memo: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastModifiedBy: z.string().nullish(),
});
