import * as z from "zod";

export const productCategorySchema = z.object({
  id: z.string(),
  productId: z.string(),
  categoryId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastModifiedBy: z.string().nullish(),
});
