/* cspell:disable */
import { z } from "zod";

export const actionTypeEnum = z.nativeEnum({
  READ: "READ",
  WRITE: "WRITE",
  DELETE: "DELETE",
} as {
  READ: "READ";
  WRITE: "WRITE";
  DELETE: "DELETE";
});

export type ActionType = "READ" | "WRITE" | "DELETE";

export const ActionType = {
  READ: "READ" as ActionType,
  WRITE: "WRITE" as ActionType,
  DELETE: "DELETE" as ActionType,
};

export const actionStatusEnum = z.nativeEnum({
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
} as {
  SUCCESS: "SUCCESS";
  FAILED: "FAILED";
});

export type ActionStatus = "SUCCESS" | "FAILED";

export const ActionStatus = {
  SUCCESS: "SUCCESS" as ActionStatus,
  FAILED: "FAILED" as ActionStatus,
};

export const genderEnum = z.nativeEnum({
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
} as {
  MALE: "MALE";
  FEMALE: "FEMALE";
  OTHER: "OTHER";
});

export type Gender = "MALE" | "FEMALE" | "OTHER";

export const Gender = {
  MALE: "MALE" as Gender,
  FEMALE: "FEMALE" as Gender,
  OTHER: "OTHER" as Gender,
};

export const messageStatusEnum = z.nativeEnum({
  PENDING: "PENDING",
  SENT: "SENT",
  FAILED: "FAILED",
} as {
  PENDING: "PENDING";
  SENT: "SENT";
  FAILED: "FAILED";
});

export type MessageStatus = "PENDING" | "SENT" | "FAILED";

export const MessageStatus = {
  PENDING: "PENDING" as MessageStatus,
  SENT: "SENT" as MessageStatus,
  FAILED: "FAILED" as MessageStatus,
};

export const messageTypeEnum = z.nativeEnum({
  SMS: "SMS",
  EMAIL: "EMAIL",
  PHONE: "PHONE",
  SLACK: "SLACK",
  ZALO: "ZALO",
} as {
  SMS: "SMS";
  EMAIL: "EMAIL";
  PHONE: "PHONE";
  SLACK: "SLACK";
  ZALO: "ZALO";
});

export type MessageType =
  | "SMS"
  | "EMAIL"
  | "PHONE"
  | "SLACK"
  | "ZALO";

export const MessageType = {
  SMS: "SMS" as MessageType,
  EMAIL: "EMAIL" as MessageType,
  PHONE: "PHONE" as MessageType,
  SLACK: "SLACK" as MessageType,
  ZALO: "ZALO" as MessageType,
};
