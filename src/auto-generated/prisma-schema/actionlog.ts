import * as z from "zod";
import { actionStatusEnum } from "./enums";

export const actionLogSchema = z.object({
  id: z.string(),
  userId: z.string(),
  actionId: z.string(),
  params: z.string(),
  status: actionStatusEnum,
  createdAt: z.date(),
  updatedAt: z.date(),
});
