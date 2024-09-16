import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import { loadAll } from "@/services/data-loaders";
import { z } from "zod";

const response = actionConfigs[Actions.GET_TEMPLATES].schema.response;

const templateSchema = response.shape.templates.transform(
  (array) => array[0],
);

export type Template = z.infer<typeof templateSchema>;

export async function getAllTemplates(noCache: boolean) {
  return await loadAll<Template>({
    key: "templates",
    action: Actions.GET_TEMPLATES,
    noCache,
  });
}
