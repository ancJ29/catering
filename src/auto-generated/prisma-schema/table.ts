import * as z from "zod";

export const tableSchema = z.object({
  id: z.string(),
  name: z.string(),
  branchId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastModifiedBy: z.string().nullish(),
});
