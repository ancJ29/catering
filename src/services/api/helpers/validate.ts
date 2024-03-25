import {
  ActionConfig,
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import logger from "@/services/logger";
import useAuthStore from "@/stores/auth.store";
import validator from "./validator";

const shouldValidateParams = import.meta.env.DEV;
const shouldValidateResponse = import.meta.env.DEV;

export function _validateParams<T>(action: string, params?: T) {
  if (!shouldValidateParams) {
    return params;
  }
  if (params) {
    const payload = useAuthStore.getState().user || undefined;
    const _params = params as Record<string, unknown>;
    return validator(payload, action, _params) as T;
  }
  return params;
}

export function _validateResponse<R>(action: string, data: R): R {
  if (!shouldValidateResponse) {
    return data;
  }
  const actionConfig = actionConfigs[
    action as Actions
  ] as ActionConfig;
  if (actionConfig?.schema?.response) {
    const res = actionConfig.schema.response.safeParse(data);
    if (!res.success) {
      logger.error("[api-v2-invalid-response]", res.error);
      logger.error("[api-v2-invalid-response-data]", data);
      throw new Error("Invalid response");
    } else {
      data = res.data as R;
    }
  }
  return data;
}
