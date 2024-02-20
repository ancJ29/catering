import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import cache from "@/services/cache";
import { loadAll } from "@/services/data-loaders";
import logger from "@/services/logger";
import { OptionProps } from "@/types";
import { z } from "zod";

const response = actionConfigs[Actions.GET_MATERIALS].schema.response;

const materialSchema = response.shape.materials.transform(
  (array) => array[0],
);

const schema = response.omit({ cursor: true, hasMore: true });

export type Material = z.infer<typeof materialSchema> & {
  typeName?: string;
};

export async function getMaterialById(
  id: string,
): Promise<Material | undefined> {
  let materials = await loadAll<Material>({
    key: "materials",
    action: Actions.GET_MATERIALS,
    params: { id },
    noCache: true,
  });
  materials = materials.map((material) => {
    material.name = material.name.replace(/\.[0-9]+$/g, "");
    return material;
  });
  return materials.length ? materials[0] : undefined;
}

export async function getAllMaterials(
  noCache = false,
): Promise<Material[]> {
  const key = "domain.material.getAllMaterials";
  if (!noCache && cache.has(key)) {
    const res = schema.safeParse(cache.get(key));
    if (res.success) {
      logger.debug("cache hit", key);
      return res.data.materials;
    }
  }
  let materials = await loadAll<Material>({
    key: "materials",
    action: Actions.GET_MATERIALS,
  });
  materials = materials.map((material) => {
    material.name = material.name.replace(/\.[0-9]+$/g, "");
    return material;
  });
  cache.set(key, { materials });
  return materials;
}

export function typeAndGroupOptions(
  materialGroupByType: Record<string, string[]>,
  type: string | null,
  t: (key: string) => string,
) {
  const typeOptions: OptionProps[] = Object.keys(
    materialGroupByType,
  ).map((type: string) => ({
    label: t(`materials.type.${type}`),
    value: type,
  }));
  let groupOptions: OptionProps[] = [];
  if (type && type in materialGroupByType) {
    groupOptions = Object.values(materialGroupByType[type]).map(
      (group) => ({
        label: t(`materials.group.${group}`),
        value: group,
      }),
    );
  } else {
    groupOptions = Object.values(materialGroupByType)
      .map((e) => Object.values(e))
      .flat()
      .map((group) => ({
        label: t(`materials.group.${group}`),
        value: group,
      }));
  }
  return [typeOptions, groupOptions];
}
