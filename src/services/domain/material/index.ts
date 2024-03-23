import {
  Actions,
  configs as actionConfigs,
  numberSchema,
  stringSchema,
  xMaterialSchema,
} from "@/auto-generated/api-configs";
import callApi from "@/services/api";
import { loadAll } from "@/services/data-loaders";
import logger from "@/services/logger";
import { OptionProps } from "@/types";
import { z } from "zod";

const response =
  actionConfigs[Actions.GET_ALL_MATERIALS].schema.response;

const materialSchema = response.transform((array) => array[0]);

const cacheSchema = xMaterialSchema
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    createdAt: z.string(),
    updatedAt: z.string(),
    supplierMaterials: z
      .object({
        price: numberSchema.nonnegative(),
        supplier: z.object({
          id: stringSchema,
          name: stringSchema,
        }),
      })
      .array(),
  })
  .transform((el) => ({
    ...el,
    createdAt: new Date(el.createdAt),
    updatedAt: new Date(el.updatedAt),
  }))
  .array();

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
    material.name = material.name.split("___")[0];
    return material;
  });
  return materials.length ? materials[0] : undefined;
}

export async function getAllMaterials(
  noCache = false,
): Promise<Material[]> {
  try {
    if (!noCache && localStorage.__ALL_MATERIALS__) {
      const res = cacheSchema.safeParse(
        JSON.parse(localStorage.__ALL_MATERIALS__),
      );
      if (res.success) {
        logger.trace("cache hit");
        return res.data;
      } else {
        logger.info("cache invalid", res.error);
      }
    }
  } catch (e) {
    logger.error("cache error", e);
  }
  const materials =
    (await callApi<unknown, Material[]>({
      action: Actions.GET_ALL_MATERIALS,
      options: { noCache: true },
    }).then((materials) =>
      materials?.map((material) => {
        material.name = material.name.split("___")[0];
        return material;
      }),
    )) || [];
  materials.sort((a, b) =>
    a.others.type.localeCompare(b.others.type),
  );
  localStorage.__ALL_MATERIALS__ = JSON.stringify(materials);
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
