import * as z from "zod";
import { genderEnum } from "./enums";

export const contactSchema = z.object({
  id: z.string(),
  clientId: z.number().int(),
  name: z.string(),
  code: z.string(),
  shortName: z.string(),
  gender: genderEnum.nullish(),
  phone: z.string(),
  email: z.string().nullish(),
  address: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
