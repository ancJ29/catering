import * as z from "zod";

export const customerContactSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  contactId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastModifiedBy: z.string().nullish(),
});
