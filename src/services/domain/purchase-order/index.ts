import {
  Actions,
  POStatus,
  configs as actionConfigs,
  poStatusSchema,
  prPrioritySchema,
  prTypeSchema,
} from "@/auto-generated/api-configs";
import callApi from "@/services/api";
import { loadAll } from "@/services/data-loaders";
import { OptionProps } from "@/types";
import { endOfWeek, startOfWeek } from "@/utils";
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
  from = startOfWeek(Date.now()),
  to = endOfWeek(Date.now()),
  hasDepartment: boolean,
  hasSupplier: boolean,
  status?: POStatus,
): Promise<PurchaseOrder[]> {
  return await loadAll<PurchaseOrder>({
    key: "purchaseOrders",
    action: Actions.GET_PURCHASE_ORDERS,
    take: 20,
    params: {
      from,
      to,
      status,
      departmentId: hasDepartment ? { not: null } : null,
      supplierId: hasSupplier ? { not: null } : null,
    },
  });
}

type PurchaseOrderProps = {
  from?: number;
  to?: number;
  status?: POStatus;
  hasDepartment?: boolean;
  hasSupplier?: boolean;
};

export async function getPurchaseOrders({
  from,
  to,
  status,
  hasDepartment = false,
  hasSupplier = false,
}: PurchaseOrderProps) {
  return _getPurchaseOrders(
    from,
    to,
    hasDepartment,
    hasSupplier,
    status,
  ).then((purchaseOrders) => {
    return purchaseOrders.map((el) => ({
      ...el,
      name: el.code,
    }));
  });
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

export function typePriorityAndStatusOrderOptions(
  t: (key: string) => string,
) {
  const typeOptions: OptionProps[] = prTypeSchema.options.map(
    (type) => ({
      label: t(`purchaseRequest.type.${type}`),
      value: type,
    }),
  );
  const priorityOptions: OptionProps[] = prPrioritySchema.options.map(
    (priority) => ({
      label: t(`purchaseRequest.priority.${priority}`),
      value: priority,
    }),
  );
  const statusOptions: OptionProps[] = poStatusSchema.options.map(
    (status) => ({
      label: t(`purchaseOrder.status.${status}`),
      value: status,
    }),
  );
  return [typeOptions, priorityOptions, statusOptions];
}

export function statusOrderColor(status: POStatus, level = 6) {
  const colors: Record<POStatus, string> = {
    // cspell:disable
    CXL: "cyan",
    CPH: "green",
    PH: "orange",
    SSGH: "violet",
    DGH: "grape",
    NK1P: "blue",
    DNK: "teal",
    DKT: "lime",
    DTDNTT: "yellow",
    // cspell:disable
  };
  if (!status) {
    return "";
  }
  return `${colors[status]}.${level}`;
}
