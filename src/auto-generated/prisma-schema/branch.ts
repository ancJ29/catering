import * as z from "zod";

export const branchSchema = z.object({
  id: z.string(),
  name: z.string(),
  shortName: z.string(),
  phone: z.string(),
  email: z.string(),
  chainId: z.string(),
  address: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
