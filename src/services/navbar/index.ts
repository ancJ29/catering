import {
  optionalStringSchema,
  stringSchema,
} from "@/auto-generated/api-configs";
import menu from "@/configs/navbar/menu.json";
import z from "zod";

const baseMenuItem = z.object({
  key: stringSchema,
  label: stringSchema,
  icon: optionalStringSchema,
  url: optionalStringSchema,
});

type MenuItem = z.infer<typeof baseMenuItem> & {
  subs?: MenuItem[];
};

export const menuSchema: z.ZodType<MenuItem[]> = baseMenuItem
  .extend({
    subs: z.lazy(() => baseMenuItem.array().optional()),
  })
  .array();

export type Menu = z.infer<typeof menuSchema>;

export function buildMenu(): Menu {
  return menuSchema.parse(menu);
}
