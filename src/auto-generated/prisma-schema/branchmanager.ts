import * as z from "zod";

export const branchManagerSchema = z.object({
  id: z.string(),
  branchId: z.string(),
  managerId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
