import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import cache from "@/services/cache";
import { loadAll } from "@/services/data-loaders";
import logger from "@/services/logger";
import { z } from "zod";

const response = actionConfigs[Actions.GET_MATERIALS].schema.response;

const materialSchema = response.shape.materials.transform(
  (array) => array[0],
);

const schema = response.omit({ cursor: true, hasMore: true });

export type Material = z.infer<typeof materialSchema> & {
  typeName?: string;
};

export async function getAllMaterials(noCache = false): Promise<Material[]> {
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
