import * as z from "zod";

export const supplierContactSchema = z.object({
  id: z.string(),
  supplierId: z.string(),
  contactId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  customerId: z.string().nullish(),
});
