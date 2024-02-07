import { z } from "zod";

export const customerOthersSchema = z.object({
  cateringId: z.string(),
  cateringName: z.string(),
  type: z.enum(["company"]),
  targets: z
    .object({
      name: z.string(),
    })
    .array(),
});
