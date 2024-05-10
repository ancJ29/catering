import {
  Actions,
  PurchaseOrderPriority,
  PurchaseOrderStatus,
  configs as actionConfigs,
  purchaseOrderPrioritySchema,
  purchaseOrderStatusSchema,
  purchaseOrderTypeSchema,
} from "@/auto-generated/api-configs";
import { loadAll } from "@/services/data-loaders";
import { OptionProps } from "@/types";
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

export async function _getPurchaseOrders(
  from = startOfDay(Date.now() - ONE_DAY),
  to = endOfDay(Date.now() + ONE_DAY),
): Promise<PurchaseOrder[]> {
  return await loadAll<PurchaseOrder>({
    key: "purchaseOrders",
    action: Actions.GET_PURCHASE_ORDERS,
    take: 20,
    params: { from, to },
  });
}

export async function getPurchaseOrders(from?: number, to?: number) {
  return _getPurchaseOrders(from, to).then((purchaseOrders) => {
    return purchaseOrders.map((el) => ({
      ...el,
      name: el.poCode,
    }));
  });
}

export function typeStatusAndPriorityOptions(
  t: (key: string) => string,
) {
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

export function poStatusColor(
  status: PurchaseOrderStatus | undefined,
  level = 6,
) {
  const colors: Record<PurchaseOrderStatus, string> = {
    DG: "cyan",
    DD: "green",
    KD: "orange",
    DDP: "violet",
    MH: "grape",
    DNH: "blue",
    NH: "teal",
    DH: "red",
  };
  if (!status) {
    return "";
  }
  return `${colors[status]}.${level}`;
}

export function poPriorityColor(
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
