import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import callApi from "@/services/api";
import { loadAll } from "@/services/data-loaders";
import { z } from "zod";

const response =
  actionConfigs[Actions.GET_NOTIFICATIONS].schema.response;

const notificationSchema = response.shape.notifications.transform(
  (array) => array[0],
);

export type Notification = z.infer<typeof notificationSchema>;

export async function getNotifications(from?: number, to?: number) {
  return await loadAll<Notification>({
    key: "notifications",
    action: Actions.GET_NOTIFICATIONS,
    params: {
      from,
      to,
    },
    noCache: true,
  });
}

const { request: addRequest } =
  actionConfigs[Actions.ADD_NOTIFICATION].schema;
export type AddNotificationRequest = z.infer<typeof addRequest>;

export async function addNotification(
  params: AddNotificationRequest,
) {
  await callApi<AddNotificationRequest, { id: string }>({
    action: Actions.ADD_NOTIFICATION,
    params,
  });
}

const { request: updateRequest } =
  actionConfigs[Actions.UPDATE_NOTIFICATION].schema;
export type UpdateNotificationRequest = z.infer<typeof updateRequest>;

export async function updateNotification(
  params: UpdateNotificationRequest,
) {
  await callApi<UpdateNotificationRequest, { id: string }>({
    action: Actions.UPDATE_NOTIFICATION,
    params,
  });
}
