import {
  Actions,
  PurchaseOrderPriority,
  PurchaseOrderStatus,
  configs as actionConfigs,
  purchaseOrderPrioritySchema,
  purchaseOrderStatusSchema,
  purchaseOrderTypeSchema,
  xPurchaseOrderSchema,
} from "@/auto-generated/api-configs";
import cache from "@/services/cache";
import { loadAll } from "@/services/data-loaders";
import logger from "@/services/logger";
import { OptionProps } from "@/types";
import { ONE_DAY } from "@/utils";
import { z } from "zod";

const response =
  actionConfigs[Actions.GET_PURCHASE_ORDERS].schema.response;

const purchaseOrderSchema = response.shape.purchaseOrders.transform(
  (array) => array[0],
);

export type PurchaseOrder = z.infer<typeof purchaseOrderSchema> & {
  name: string;
};

const cacheSchema = xPurchaseOrderSchema
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .transform((el) => ({
    ...el,
    createdAt: new Date(el.createdAt),
    updatedAt: new Date(el.updatedAt),
  }))
  .array();

export async function getAllPurchaseOrders(
  noCache = false,
  from = Date.now() - ONE_DAY,
  to = Date.now() + ONE_DAY,
): Promise<PurchaseOrder[]> {
  const key = "domain.purchaseOrder.getAllPurchaseOrders";
  if (!noCache && cache.has(key)) {
    const res = cacheSchema.safeParse(cache.get(key));
    if (res.success) {
      logger.trace("cache hit", key);
      return res.data.map((e) => ({ ...e, name: "" }));
    }
  }
  const purchaseOrders = await loadAll<PurchaseOrder>({
    key: "purchaseOrders",
    action: Actions.GET_PURCHASE_ORDERS,
    take: 20,
    params: { from, to },
  });
  cache.set(key, { purchaseOrders });
  return purchaseOrders;
}

export function getFilterData(t: (key: string) => string) {
  const typeOptions: OptionProps[] =
    purchaseOrderTypeSchema.options.map((type) => ({
      label: t(`purchaseOrder.type.${type}`),
      value: type,
    }));

  const statusOptions: OptionProps[] =
    purchaseOrderStatusSchema.options.map((status) => ({
      label: t(`purchaseOrder.status.${status}`),
      value: status,
    }));

  const priorityOptions: OptionProps[] =
    purchaseOrderPrioritySchema.options.map((priority) => ({
      label: t(`purchaseOrder.priority.${priority}`),
      value: priority,
    }));

  return [typeOptions, statusOptions, priorityOptions];
}

export function purchaseOrderStatusColor(
  status: PurchaseOrderStatus | undefined,
  level = 4,
) {
  const colors: Record<PurchaseOrderStatus, string> = {
    DG: "cyan",
    DD: "violet",
    KD: "grape",
    DDP: "blue",
    MH: "lime",
    DNH: "orange",
    NH: "pink",
    DH: "red",
  };
  if (!status) {
    return "";
  }
  return `${colors[status]}.${level}`;
}

export function purchaseOrderPriorityColor(
  priority: PurchaseOrderPriority | undefined,
  level = 6,
) {
  const colors: Record<PurchaseOrderPriority, string> = {
    BT: "blue",
    KC: "red",
  };
  if (!priority) {
    return "";
  }
  return `${colors[priority]}.${level}`;
}
