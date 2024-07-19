import {
  Actions,
  ClientRoles,
  POStatus,
  configs as actionConfigs,
  poStatusSchema,
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

export type PurchaseOrderDetail =
  PurchaseOrder["purchaseOrderDetails"][0];

async function _getPurchaseOrders(
  from = startOfWeek(Date.now()),
  to = endOfWeek(Date.now()),
  statuses?: POStatus[],
): Promise<PurchaseOrder[]> {
  return await loadAll<PurchaseOrder>({
    key: "purchaseOrders",
    action: Actions.GET_PURCHASE_ORDERS,
    params: {
      from,
      to,
      statuses,
    },
  });
}

type PurchaseOrderProps = {
  from?: number;
  to?: number;
  statuses?: POStatus[];
};

export async function getPurchaseOrders({
  from,
  to,
  statuses = [],
}: PurchaseOrderProps) {
  return _getPurchaseOrders(from, to, statuses).then(
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

const { request: addRequest } =
  actionConfigs[Actions.ADD_PURCHASE_ORDER].schema;
export type AddPurchaseOrderRequest = z.infer<typeof addRequest>;

export async function addPurchaseOrders(
  params: AddPurchaseOrderRequest,
) {
  await callApi<AddPurchaseOrderRequest, { id: string }>({
    action: Actions.ADD_PURCHASE_ORDER,
    params,
  });
}

const { request: updateStatusRequest } =
  actionConfigs[Actions.UPDATE_PURCHASE_ORDER_STATUS].schema;
type UpdateStatusRequest = z.infer<typeof updateStatusRequest>;

export async function updatePurchaseOrderStatus(
  params: UpdateStatusRequest,
) {
  await callApi<UpdateStatusRequest, { id: string }>({
    action: Actions.UPDATE_PURCHASE_ORDER_STATUS,
    params,
    options: {
      toastMessage: "Purchase order status updated",
      reloadOnSuccess: {
        delay: 700,
      },
    },
  });
}

const { request: updateRequest } =
  actionConfigs[Actions.UPDATE_PURCHASE_ORDER].schema;
type UpdateRequest = z.infer<typeof updateRequest>;

export async function updatePurchaseOrder(params: UpdateRequest) {
  await callApi<UpdateRequest, { id: string }>({
    action: Actions.UPDATE_PURCHASE_ORDER,
    params,
  });
}

export function statusOrderOptions(t: (key: string) => string) {
  const statusOptions: OptionProps[] = poStatusSchema.options.map(
    (status) => ({
      label: t(`purchaseOrder.status.${status}`),
      value: status,
    }),
  );
  return [statusOptions];
}

export function statusOrderColor(status: POStatus, level = 6) {
  const colors: Record<POStatus, string> = {
    // cspell:disable
    DG: "cyan", // Đã gửi: đã tạo & gửi PO đến NCC
    DTC: "red", // Đã từ chối: NCC từ chối PO
    DD: "green", // Đã duyệt: NCC duyệt PO
    SSGH: "blue", // Sẵn sàng giao hàng
    NK1P: "teal", // Nhập kho 1 phần
    DNK: "teal", // Đã nhập kho
    DKTSL: "violet", // Đã kiểm tra sai lệch
    DTDNTT: "lime", // Đã tạo đề nghị thanh toán
    DCBSHD: "yellow", // Đã cập nhật số hoá đơn
    DLLTT: "yellow", // Đã lập lịch thanh toán
    TT1P: "orange", // Thanh toán 1 phần
    DTT: "orange", // Đã thanh toán
    // cspell:disable
  };
  if (!status) {
    return "";
  }
  return `${colors[status]}.${level}`;
}

export function changeablePurchaseOrderStatus(
  current: POStatus,
  next: POStatus,
  role?: ClientRoles,
) {
  if (current === "DTC") {
    return false;
  }
  if (!role) {
    return false;
  }
  if (role === ClientRoles.OWNER) {
    return true;
  }
  // if (role === ClientRoles.OWNER || role === ClientRoles.SUPPLIER) {
  //   return true;
  // }
  return false;
}
