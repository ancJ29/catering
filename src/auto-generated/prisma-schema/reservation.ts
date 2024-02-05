import * as z from "zod";
import { reservationStatusEnum } from "./enums";

export const reservationSchema = z.object({
  id: z.string(),
  clientId: z.number().int(),
  contactName: z.string(),
  phone: z.string(),
  code: z.string(),
  departmentId: z.string(),
  tableId: z.string(),
  contactId: z.string().nullish(),
  date: z.date(),
  note: z.string().nullish(),
  status: reservationStatusEnum,
  staffId: z.string().nullish(),
  adults: z.number().int(),
  children: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
