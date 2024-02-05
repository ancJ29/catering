import * as z from "zod";

export const chainManagerSchema = z.object({
  id: z.string(),
  chainId: z.string(),
  managerId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
