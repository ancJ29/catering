import {
  Actions,
  ClientRoles,
  PICateringStatus,
  PIStatus,
  configs as actionConfigs,
  piCateringStatusSchema,
  piStatusCatering,
  piStatusSchema,
  purchaseInternalOthersSchema,
  stringSchema,
  xPurchaseInternalSchema,
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
  PurchaseInternal["purchaseInternalDetails"][0] & {
    name: string;
  };

const { request: addRequest } =
  actionConfigs[Actions.ADD_PURCHASE_INTERNAL].schema;
export type AddPurchaseInternalRequest = z.infer<typeof addRequest>;

async function _getPurchaseInternals(
  from = startOfWeek(Date.now()),
  to = endOfWeek(Date.now()),
  receivingCateringId?: string,
  deliveryCateringId?: string,
  statuses?: PIStatus[],
): Promise<PurchaseInternal[]> {
  return await loadAll<PurchaseInternal>({
    key: "purchaseInternals",
    action: Actions.GET_PURCHASE_INTERNALS,
    params: {
      from,
      to,
      receivingCateringId,
      deliveryCateringId,
      statuses,
    },
  });
}

export async function getPurchaseInternals(
  from?: number,
  to?: number,
  receivingCateringId?: string,
) {
  return _getPurchaseInternals(from, to, receivingCateringId).then(
    (purchaseInternals) => {
      return purchaseInternals.map((el) => ({
        ...el,
        name: el.code,
      }));
    },
  );
}

const xPurchaseInternalCateringSchema = xPurchaseInternalSchema
  .omit({
    others: true,
  })
  .extend({
    name: stringSchema,
    others: purchaseInternalOthersSchema
      .omit({
        status: true,
      })
      .extend({
        status: piCateringStatusSchema,
      }),
  });

export type PurchaseInternalCatering = z.infer<
  typeof xPurchaseInternalCateringSchema
>;

export async function getPurchaseInternalsByCatering(
  from?: number,
  to?: number,
  receivingCateringId?: string,
  deliveryCateringId?: string,
  statuses?: PIStatus[],
): Promise<PurchaseInternalCatering[]> {
  return _getPurchaseInternals(
    from,
    to,
    receivingCateringId,
    deliveryCateringId,
    statuses,
  ).then((purchaseInternal) => {
    return purchaseInternal.map((el) => ({
      ...el,
      name: el.code,
      others: {
        ...el.others,
        status: getPICateringStatus(el.others.status),
      },
    }));
  });
}

export function getPICateringStatus(
  status: PIStatus,
): PICateringStatus {
  return piStatusCatering[status];
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

export async function updatePurchaseInternal(
  params: UpdateRequest,
  showToast = true,
) {
  await callApi<UpdateRequest, { id: string }>({
    action: Actions.UPDATE_PURCHASE_INTERNAL,
    params,
    options: showToast
      ? {
        toastMessage: "Your changes have been saved",
      }
      : undefined,
  });
}

const { request: updateStatusRequest } =
  actionConfigs[Actions.UPDATE_PURCHASE_INTERNAL_STATUS].schema;
type UpdateStatusRequest = z.infer<typeof updateStatusRequest>;
export async function updatePurchaseInternalStatus(
  params: UpdateStatusRequest,
  showToast = true,
) {
  await callApi<UpdateStatusRequest, { id: string }>({
    action: Actions.UPDATE_PURCHASE_INTERNAL_STATUS,
    params,
    options: {
      toastMessage: showToast
        ? "Purchase internal status updated"
        : undefined,
      reloadOnSuccess: showToast
        ? {
          delay: 700,
        }
        : undefined,
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

export function statusInternalCateringOptions(
  t: (key: string) => string,
) {
  const statusOptions: OptionProps[] =
    piCateringStatusSchema.options.map((status) => ({
      label: t(`purchaseInternal.cateringStatus.${status}`),
      value: status,
    }));
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

export function statusInternalCateringColor(
  status: PICateringStatus,
  level = 6,
) {
  const colors: Record<PICateringStatus, string> = {
    // cspell:disable
    CN: "cyan", // Chưa nhận
    CNK: "orange", // Chờ nhập kho
    PINHT: "yellow", // PI nhận hoàn tất
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
  if (role === ClientRoles.OWNER || role === ClientRoles.CATERING) {
    return true;
  }
  return false;
}

export function changeablePurchaseInternalCateringStatus(
  current: PICateringStatus,
  next: PICateringStatus,
  role?: ClientRoles,
) {
  if (!role) {
    return false;
  }
  if (role === ClientRoles.OWNER || role === ClientRoles.CATERING) {
    return true;
  }
  return false;
}
