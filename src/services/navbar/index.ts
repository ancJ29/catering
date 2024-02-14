import menu from "@/configs/navbar/menu.json";
import z from "zod";

const baseMenuItem = z.object({
  key: z.string(),
  label: z.string(),
  icon: z.string().optional(),
  url: z.string().optional(),
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
