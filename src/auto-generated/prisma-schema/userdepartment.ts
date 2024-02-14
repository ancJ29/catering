import * as z from "zod";

export const userDepartmentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  departmentId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastModifiedBy: z.string().nullish(),
});
