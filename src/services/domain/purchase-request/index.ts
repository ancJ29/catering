import {
  Actions,
  PRPriority,
  PRStatus,
  configs as actionConfigs,
  prPrioritySchema,
  prStatusSchema,
  prTypeSchema,
} from "@/auto-generated/api-configs";
import { loadAll } from "@/services/data-loaders";
import { OptionProps } from "@/types";
import { ONE_DAY, endOfDay, startOfDay } from "@/utils";
import { z } from "zod";

const response =
  actionConfigs[Actions.GET_PURCHASE_REQUESTS].schema.response;

const purchaseRequestSchema =
  response.shape.purchaseRequests.transform((array) => array[0]);

export type PurchaseRequest = z.infer<
  typeof purchaseRequestSchema
> & {
  name: string;
};

export async function _getPurchaseRequests(
  from = startOfDay(Date.now() - ONE_DAY),
  to = endOfDay(Date.now() + ONE_DAY),
): Promise<PurchaseRequest[]> {
  return await loadAll<PurchaseRequest>({
    key: "purchaseRequests",
    action: Actions.GET_PURCHASE_REQUESTS,
    take: 20,
    params: { from, to },
  });
}

export async function getPurchaseRequests(
  from?: number,
  to?: number,
) {
  return _getPurchaseRequests(from, to).then((purchaseRequests) => {
    return purchaseRequests.map((el) => ({
      ...el,
      name: el.prCode,
    }));
  });
}

export function typeStatusAndPriorityOptions(
  t: (key: string) => string,
) {
  const typeOptions: OptionProps[] = prTypeSchema.options.map(
    (type) => ({
      label: t(`purchaseRequest.type.${type}`),
      value: type,
    }),
  );

  const statusOptions: OptionProps[] = prStatusSchema.options.map(
    (status) => ({
      label: t(`purchaseRequest.status.${status}`),
      value: status,
    }),
  );

  const priorityOptions: OptionProps[] = prPrioritySchema.options.map(
    (priority) => ({
      label: t(`purchaseRequest.priority.${priority}`),
      value: priority,
    }),
  );

  return [typeOptions, statusOptions, priorityOptions];
}

export function prStatusColor(
  status: PRStatus | undefined,
  level = 6,
) {
  const colors: Record<PRStatus, string> = {
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

export function prPriorityColor(
  priority: PRPriority | undefined,
  level = 6,
) {
  const colors: Record<PRPriority, string> = {
    BT: "blue",
    KC: "red",
  };
  if (!priority) {
    return "";
  }
  return `${colors[priority]}.${level}`;
}
