import * as z from "zod";

export const departmentSchema = z.object({
  id: z.string(),
  clientId: z.number().int(),
  name: z.string(),
  type: z.string().nullish(),
  code: z.string(),
  shortName: z.string().nullish(),
  phone: z.string().nullish(),
  email: z.string().nullish(),
  address: z.string().nullish(),
  level: z.number().int(),
  supId: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
