import {
  Actions,
  ClientRoles,
  PRPriority,
  PRStatus,
  PRType,
  configs as actionConfigs,
  prPrioritySchema,
  prStatusSchema,
  prTypeSchema,
} from "@/auto-generated/api-configs";
import callApi from "@/services/api";
import { loadAll } from "@/services/data-loaders";
import {
  OptionProps,
  PurchaseRequestForm,
  RequestDetail,
} from "@/types";
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

export type PurchaseRequestDetail =
  PurchaseRequest["purchaseRequestDetails"][0];

const { request: addRequest } =
  actionConfigs[Actions.ADD_PURCHASE_REQUEST].schema;
type AddRequest = z.infer<typeof addRequest>;

const { request: updateRequest } =
  actionConfigs[Actions.UPDATE_PURCHASE_REQUEST].schema;
type UpdateRequest = z.infer<typeof updateRequest>;

async function _getPurchaseRequests(
  from = startOfDay(Date.now() - ONE_DAY),
  to = endOfDay(Date.now() + ONE_DAY),
  status?: PRStatus,
): Promise<PurchaseRequest[]> {
  return await loadAll<PurchaseRequest>({
    key: "purchaseRequests",
    action: Actions.GET_PURCHASE_REQUESTS,
    params: { from, to, status },
  });
}

export async function getPurchaseRequests(
  from?: number,
  to?: number,
  status?: PRStatus,
) {
  return _getPurchaseRequests(from, to, status).then(
    (purchaseRequests) => {
      return purchaseRequests.map((el) => ({
        ...el,
        name: el.code,
      }));
    },
  );
}

export async function getPurchaseRequestById(
  id: string,
): Promise<PurchaseRequest | undefined> {
  const purchaseRequest = await loadAll<PurchaseRequest>({
    key: "purchaseRequests",
    action: Actions.GET_PURCHASE_REQUESTS,
    params: { id },
    noCache: true,
  });
  return purchaseRequest.length ? purchaseRequest[0] : undefined;
}

export async function addPurchaseRequest(
  purchaseRequest: PurchaseRequestForm,
  purchaseDetails: RequestDetail[],
) {
  return await callApi<AddRequest, { id: string }>({
    action: Actions.ADD_PURCHASE_REQUEST,
    params: {
      deliveryDate: getDateTime(
        purchaseRequest.deliveryDate,
        purchaseRequest.deliveryTime,
      ),
      departmentId: purchaseRequest.departmentId || "",
      others: {
        type: purchaseRequest.type as PRType,
        priority: purchaseRequest.priority as PRPriority,
      },
      purchaseRequestDetails: purchaseDetails.map((e) => ({
        materialId: e.materialId,
        amount: e.amount,
        others: {
          price: e.price || 0,
          supplierNote: e.supplierNote,
          internalNote: e.internalNote,
        },
      })),
    },
  });
}

export async function updatePurchaseRequest(
  purchaseRequest: PurchaseRequest,
  purchaseDetails: RequestDetail[],
  deletedRequestDetailIds: string[],
  status: PRStatus,
  priority: string,
) {
  if (!purchaseRequest) {
    return;
  }

  await callApi<UpdateRequest, { id: string }>({
    action: Actions.UPDATE_PURCHASE_REQUEST,
    params: {
      id: purchaseRequest.id,
      deliveryDate: purchaseRequest.deliveryDate,
      departmentId: purchaseRequest.departmentId,
      others: {
        type: purchaseRequest.others.type,
        priority:
          (priority as PRPriority) ?? purchaseRequest.others.priority,
        status,
      },
      purchaseRequestDetails: purchaseDetails.map((e) => ({
        id: e?.id || "",
        materialId: e.materialId,
        amount: e.amount,
        others: {
          price: e.price || 0,
          supplierNote: e.supplierNote,
          internalNote: e.internalNote,
        },
      })),
      deletePurchaseRequestDetailIds: deletedRequestDetailIds,
    },
    options: {
      toastMessage: "Your changes have been saved",
    },
  });
}

export function typePriorityAndStatusRequestOptions(
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

export function statusRequestColor(status: PRStatus, level = 6) {
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

export function changeablePurchaseRequestStatus(
  current: PRStatus,
  next: PRStatus,
  role?: ClientRoles,
) {
  if (current === "KD" || current === "DH") {
    return false;
  }
  if (!role) {
    return false;
  }
  if (
    (current === "DG" || current === "DD" || current === "DDP") &&
    (next === "DD" ||
      next === "KD" ||
      next === "DDP" ||
      next === "DH")
  ) {
    if (role === ClientRoles.OWNER) {
      return true;
    }
  }
  // if (role === ClientRoles.OWNER) {
  //   return true;
  // }
  // if (next === "DNH" || next === "NH") {
  //   return false;
  // }
  // if (role === ClientRoles.PRODUCTION) {
  //   if (current === "DG" && (next === "DD" || next === "KD")) {
  //     return true;
  //   }
  // }
  // if (role === ClientRoles.SUPPLIER) {
  //   if (current === "DD" && next === "DDP") {
  //     return true;
  //   }
  //   if (current === "DDP" && next === "MH") {
  //     return true;
  //   }
  //   if (next === "DH") {
  //     return true;
  //   }
  // }
  return false;
}
