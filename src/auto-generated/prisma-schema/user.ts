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
  phone: z.string().nullish(),
  email: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastModifiedBy: z.string().nullish(),
  chainIds: z.string().array(),
  branchIds: z.string().array(),
});
