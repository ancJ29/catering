import * as z from "zod";

export const rolePermissionSchema = z.object({
  id: z.string(),
  roleId: z.string(),
  permissionId: z.string(),
  enabled: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
