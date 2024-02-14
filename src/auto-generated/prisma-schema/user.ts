import * as z from "zod";
import { userRoleEnum } from "./enums";

export const userSchema = z.object({
  id: z.string(),
  clientId: z.number().int(),
  userName: z.string(),
  fullName: z.string(),
  password: z.string(),
  clientRoleId: z.string().nullish(),
  role: userRoleEnum.nullish(),
  active: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  chainIds: z.string().array(),
  branchIds: z.string().array(),
});
