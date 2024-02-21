import * as z from "zod";

export const deparmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  shortName: z.string(),
  phone: z.string(),
  email: z.string(),
  level: z.number().int(),
  supId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
