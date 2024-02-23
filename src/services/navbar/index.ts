import { menuSchema } from "@/auto-generated/api-configs";
import defaultMenu from "@/configs/navbar/menu.json";
import { GenericObject, Menu } from "@/types";

export function buildMenu(menu: GenericObject[] = defaultMenu): Menu {
  return menuSchema.parse(menu);
}
