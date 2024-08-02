import {
  Actions,
  ClientRoles,
  PCStatus,
  configs as actionConfigs,
  pcStatusSchema,
  prPrioritySchema,
  prTypeSchema,
} from "@/auto-generated/api-configs";
import callApi from "@/services/api";
import { loadAll } from "@/services/data-loaders";
import { OptionProps } from "@/types";
import { endOfWeek, startOfWeek } from "@/utils";
import { z } from "zod";

const response =
  actionConfigs[Actions.GET_PURCHASE_COORDINATIONS].schema.response;

const purchaseCoordinationSchema =
  response.shape.purchaseCoordinations.transform((array) => array[0]);

export type PurchaseCoordination = z.infer<
  typeof purchaseCoordinationSchema
> & {
  name: string;
};

export type PurchaseCoordinationDetail =
  PurchaseCoordination["purchaseCoordinationDetails"][0];

const { request: addRequest } =
  actionConfigs[Actions.ADD_PURCHASE_COORDINATION].schema;
export type AddPurchaseCoordinationRequest = z.infer<
  typeof addRequest
>;

async function _getPurchaseCoordinations(
  from = startOfWeek(Date.now()),
  to = endOfWeek(Date.now()),
): Promise<PurchaseCoordination[]> {
  return await loadAll<PurchaseCoordination>({
    key: "purchaseCoordinations",
    action: Actions.GET_PURCHASE_COORDINATIONS,
    params: {
      from,
      to,
    },
  });
}

export async function getPurchaseCoordinations(
  from?: number,
  to?: number,
) {
  return _getPurchaseCoordinations(from, to).then(
    (purchaseCoordinations) => {
      return purchaseCoordinations.map((el) => ({
        ...el,
        name: el.code,
      }));
    },
  );
}

export async function getPurchaseCoordinationById(
  id: string,
): Promise<PurchaseCoordination | undefined> {
  const purchaseCoordination = await loadAll<PurchaseCoordination>({
    key: "purchaseCoordinations",
    action: Actions.GET_PURCHASE_COORDINATIONS,
    params: { id },
    noCache: true,
  });
  return purchaseCoordination.length
    ? purchaseCoordination[0]
    : undefined;
}

export async function addPurchaseCoordination(
  params: AddPurchaseCoordinationRequest,
) {
  await callApi<AddPurchaseCoordinationRequest, { id: string }>({
    action: Actions.ADD_PURCHASE_COORDINATION,
    params: params,
  });
}

const { request: updateRequest } =
  actionConfigs[Actions.UPDATE_PURCHASE_COORDINATION].schema;
type UpdatePurchaseCoordinationRequest = z.infer<
  typeof updateRequest
>;

export async function updatePurchaseCoordination(
  params: UpdatePurchaseCoordinationRequest,
) {
  await callApi<UpdatePurchaseCoordinationRequest, { id: string }>({
    action: Actions.UPDATE_PURCHASE_COORDINATION,
    params,
  });
}

export function typePriorityAndStatusCoordinationsOptions(
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
  const statusOptions: OptionProps[] = pcStatusSchema.options.map(
    (status) => ({
      label: t(`purchaseCoordination.status.${status}`),
      value: status,
    }),
  );
  return [typeOptions, priorityOptions, statusOptions];
}

export function statusCoordinationColor(status: PCStatus, level = 6) {
  const colors: Record<PCStatus, string> = {
    // cspell:disable
    CXL: "cyan", // Chờ xử lý
    CNCCPH: "green", // Chờ nhà cung cấp phản hồi
    NCCPH: "blue", // Nhà cung cấp phản hồi
    NCCSSGH: "lime", // Nhà cung cấp sẵn sàng giao hàng
    NCCDGH: "orange", // Nhà cung cấp đã giao hàng
    // cspell:disable
  };
  if (!status) {
    return "";
  }
  return `${colors[status]}.${level}`;
}

export function changeablePurchaseCoordinationStatus(
  current: PCStatus,
  next: PCStatus,
  role?: ClientRoles,
) {
  if (!role) {
    return false;
  }
  return false;
}
