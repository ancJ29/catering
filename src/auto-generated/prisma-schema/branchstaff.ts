import * as z from "zod";

export const branchStaffSchema = z.object({
  id: z.string(),
  branchId: z.string(),
  staffId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
