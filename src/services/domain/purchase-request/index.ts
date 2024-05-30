import {
  Actions,
  PRPriority,
  PRStatus,
  configs as actionConfigs,
  prPrioritySchema,
  prStatusSchema,
  prTypeSchema,
} from "@/auto-generated/api-configs";
import {
  AddPurchaseRequestForm,
  PurchaseDetail,
} from "@/routes/purchasing-request-management/add/_config";
import callApi from "@/services/api";
import { loadAll } from "@/services/data-loaders";
import { OptionProps } from "@/types";
import { ONE_DAY, endOfDay, getDateTime, startOfDay } from "@/utils";
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

const { request } =
  actionConfigs[Actions.ADD_PURCHASE_REQUEST].schema;
type Request = z.infer<typeof request>;

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
      name: el.code,
    }));
  });
}

export async function addPurchaseRequest(
  purchaseRequest: AddPurchaseRequestForm,
  purchaseDetails: PurchaseDetail[],
) {
  await callApi<Request, { id: string }>({
    action: Actions.ADD_PURCHASE_REQUEST,
    params: {
      deliveryDate: getDateTime(
        purchaseRequest.deliveryDate,
        purchaseRequest.deliveryTime,
      ),
      departmentId: purchaseRequest.departmentId || "",
      type: purchaseRequest.type || "",
      priority: purchaseRequest.priority || "",
      purchaseRequestDetails: purchaseDetails.map((e) => ({
        materialId: e.materialId,
        amount: e.amount,
      })),
    },
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

  const priorityOptions: OptionProps[] = prPrioritySchema.options.map(
    (priority) => ({
      label: t(`purchaseRequest.priority.${priority}`),
      value: priority,
    }),
  );

  const statusOptions: OptionProps[] = prStatusSchema.options.map(
    (status) => ({
      label: t(`purchaseRequest.status.${status}`),
      value: status,
    }),
  );

  return [typeOptions, priorityOptions, statusOptions];
}

export function statusColor(status: PRStatus, level = 6) {
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

export function priorityColor(priority: PRPriority, level = 6) {
  const colors: Record<PRPriority, string> = {
    BT: "blue",
    KC: "red",
  };
  return `${colors[priority]}.${level}`;
}
