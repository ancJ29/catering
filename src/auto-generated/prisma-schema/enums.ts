/* cspell:disable */
import { z } from "zod";

export const actionTypeEnum = z.nativeEnum({
  READ: "READ",
  WRITE: "WRITE",
  DELETE: "DELETE"
} as {
  "READ": "READ",
  "WRITE": "WRITE",
  "DELETE": "DELETE",
});

export type ActionType = "READ" | "WRITE" | "DELETE";

export const ActionType = {
  "READ": "READ" as ActionType,
  "WRITE": "WRITE" as ActionType,
  "DELETE": "DELETE" as ActionType,
};

export const actionStatusEnum = z.nativeEnum({
  SUCCESS: "SUCCESS",
  FAILED: "FAILED"
} as {
  "SUCCESS": "SUCCESS",
  "FAILED": "FAILED",
});

export type ActionStatus = "SUCCESS" | "FAILED";

export const ActionStatus = {
  "SUCCESS": "SUCCESS" as ActionStatus,
  "FAILED": "FAILED" as ActionStatus,
};

export const genderEnum = z.nativeEnum({
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER"
} as {
  "MALE": "MALE",
  "FEMALE": "FEMALE",
  "OTHER": "OTHER",
});

export type Gender = "MALE" | "FEMALE" | "OTHER";

export const Gender = {
  "MALE": "MALE" as Gender,
  "FEMALE": "FEMALE" as Gender,
  "OTHER": "OTHER" as Gender,
};

export const templateTypeEnum = z.nativeEnum({
  PURCHASE_ORDER_CONFIRMATION: "PURCHASE_ORDER_CONFIRMATION"
} as {
  "PURCHASE_ORDER_CONFIRMATION": "PURCHASE_ORDER_CONFIRMATION",
});

export type TemplateType = "PURCHASE_ORDER_CONFIRMATION";

export const TemplateType = {
  "PURCHASE_ORDER_CONFIRMATION": "PURCHASE_ORDER_CONFIRMATION" as TemplateType,
};
