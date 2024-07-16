import {
  Actions,
  ClientRoles,
  PIStatus,
  configs as actionConfigs,
  piStatusSchema,
} from "@/auto-generated/api-configs";
import callApi from "@/services/api";
import { loadAll } from "@/services/data-loaders";
import { OptionProps } from "@/types";
import { endOfWeek, startOfWeek } from "@/utils";
import { z } from "zod";

const response =
  actionConfigs[Actions.GET_PURCHASE_INTERNALS].schema.response;

const purchaseInternalSchema =
  response.shape.purchaseInternals.transform((array) => array[0]);

export type PurchaseInternal = z.infer<
  typeof purchaseInternalSchema
> & {
  name: string;
};
export type PurchaseInternalDetail =
  PurchaseInternal["purchaseInternalDetails"][0];

const { request: addRequest } =
  actionConfigs[Actions.ADD_PURCHASE_INTERNAL].schema;
export type AddPurchaseInternalRequest = z.infer<typeof addRequest>;

async function _getPurchaseInternals(
  from = startOfWeek(Date.now()),
  to = endOfWeek(Date.now()),
): Promise<PurchaseInternal[]> {
  return await loadAll<PurchaseInternal>({
    key: "purchaseInternals",
    action: Actions.GET_PURCHASE_INTERNALS,
    params: {
      from,
      to,
    },
  });
}

export async function getPurchaseInternals(
  from?: number,
  to?: number,
) {
  return _getPurchaseInternals(from, to).then((purchaseInternals) => {
    return purchaseInternals.map((el) => ({
      ...el,
      name: el.code,
    }));
  });
}

export async function getPurchaseInternalById(
  id: string,
): Promise<PurchaseInternal | undefined> {
  const purchaseInternal = await loadAll<PurchaseInternal>({
    key: "purchaseInternals",
    action: Actions.GET_PURCHASE_INTERNALS,
    params: { id },
    noCache: true,
  });
  return purchaseInternal.length ? purchaseInternal[0] : undefined;
}

export async function addPurchaseInternal(
  params: AddPurchaseInternalRequest,
) {
  await callApi<AddPurchaseInternalRequest, { id: string }>({
    action: Actions.ADD_PURCHASE_INTERNAL,
    params,
  });
}

const { request: updateRequest } =
  actionConfigs[Actions.UPDATE_PURCHASE_INTERNAL].schema;
type UpdateRequest = z.infer<typeof updateRequest>;

export async function updatePurchaseInternal(params: UpdateRequest) {
  await callApi<UpdateRequest, { id: string }>({
    action: Actions.UPDATE_PURCHASE_INTERNAL,
    params,
    options: {
      toastMessage: "Your changes have been saved",
    },
  });
}

export function statusInternalOptions(t: (key: string) => string) {
  const statusOptions: OptionProps[] = piStatusSchema.options.map(
    (status) => ({
      label: t(`purchaseInternal.status.${status}`),
      value: status,
    }),
  );
  return [statusOptions];
}

export function statusInternalColor(status: PIStatus, level = 6) {
  const colors: Record<PIStatus, string> = {
    // cspell:disable
    DG: "cyan", // Đã gửi
    DD: "green", // Đã duyệt
    SSGH: "blue", // Sẵn sàng giao hàng
    NK1P: "teal", // Nhập kho một phần
    DNK: "orange", // Đã nhập kho
    // cspell:disable
  };
  if (!status) {
    return "";
  }
  return `${colors[status]}.${level}`;
}

export function changeablePurchaseInternalStatus(
  current: PIStatus,
  next: PIStatus,
  role?: ClientRoles,
) {
  if (!role) {
    return false;
  }
  return false;
}
