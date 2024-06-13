import {
  Actions,
  POStatus,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import callApi from "@/services/api";
import { loadAll } from "@/services/data-loaders";
import { ONE_DAY, endOfDay, startOfDay } from "@/utils";
import { z } from "zod";

const response =
  actionConfigs[Actions.GET_PURCHASE_ORDERS].schema.response;

const purchaseOrderSchema = response.shape.purchaseOrders.transform(
  (array) => array[0],
);

export type PurchaseOrder = z.infer<typeof purchaseOrderSchema> & {
  name: string;
};

const { request: addRequest } =
  actionConfigs[Actions.ADD_PURCHASE_ORDER].schema;
type AddRequest = z.infer<typeof addRequest>;

async function _getPurchaseOrders(
  from = startOfDay(Date.now() - ONE_DAY),
  to = endOfDay(Date.now() + ONE_DAY),
  status?: POStatus,
): Promise<PurchaseOrder[]> {
  return await loadAll<PurchaseOrder>({
    key: "purchaseOrders",
    action: Actions.GET_PURCHASE_ORDERS,
    take: 20,
    params: { from, to, status },
  });
}

export async function getPurchaseOrders(
  from?: number,
  to?: number,
  status?: POStatus,
) {
  return _getPurchaseOrders(from, to, status).then(
    (purchaseOrders) => {
      return purchaseOrders.map((el) => ({
        ...el,
        name: el.code,
      }));
    },
  );
}

export async function getPurchaseOrderById(
  id: string,
): Promise<PurchaseOrder | undefined> {
  const purchaseOrder = await loadAll<PurchaseOrder>({
    key: "purchaseOrders",
    action: Actions.GET_PURCHASE_ORDERS,
    params: { id },
    noCache: true,
  });
  return purchaseOrder.length ? purchaseOrder[0] : undefined;
}

export async function addPurchaseOrders(params: AddRequest) {
  const addResponse = await callApi<AddRequest, { id: string }>({
    action: Actions.ADD_PURCHASE_ORDER,
    params,
  });
  return addResponse?.id;
}
