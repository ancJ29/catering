import {
  menuSchema,
  payloadSchema,
} from "@/auto-generated/api-configs";
import { z } from "zod";

export * from "./common";

export type Payload = z.infer<typeof payloadSchema>;

export type OptionProps = {
  value: string | number;
  label: string;
};

export type CheckBoxOptions = {
  label: string;
  checked: boolean;
  key: string;
};

export type GenericObject = Record<string, unknown>;

export type Dictionary = Record<string, string>;

export type Menu = z.infer<typeof menuSchema>;
