import * as z from "zod";
import { actionTypeEnum } from "./enums";

export const actionSchema = z.object({
  id: z.string(),
  name: z.string(),
  group: z.string(),
  type: actionTypeEnum,
  system: z.boolean(),
  public: z.boolean(),
  enabled: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
