import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import callApi from "@/services/api";
import { z } from "zod";

const { response } = actionConfigs[Actions.GET_BOM].schema;
const bomSchema = response.transform((array) => array[0]);
export type Bom = z.infer<typeof bomSchema>;

export async function pushBom(bom: Bom) {
  await callApi({
    action: Actions.PUSH_BOM,
    params: bom,
    options: {
      toastMessage: "Bom updated",
    },
  });
}

export async function getBom(productId: string) {
  const data = await callApi<unknown, Bom[]>({
    action: Actions.GET_BOM,
    params: { productId },
    options: { noCache: true },
  });
  return data?.[0] || null;
}
