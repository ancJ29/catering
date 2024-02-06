import * as z from "zod";

export const menuProductSchema = z.object({
  id: z.string(),
  menuId: z.string(),
  productId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastModifiedBy: z.string().nullish(),
});
