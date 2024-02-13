import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import { z } from "zod";

export const targetSchema = actionConfigs[
  Actions.GET_CUSTOMERS
].schema.response.shape.customers
  .transform((array) => {
    return array[0].others.targets;
  })
  .transform((array) => array[0]);

export type Target = z.infer<typeof targetSchema>;

export const weekdays = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];
