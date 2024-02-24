import {
  ActionConfig,
  Actions,
  Policy,
  RequestDecorator,
  configs as actionConfigs,
  checkers as policyCheckers,
  decorators as requestDecorators,
} from "@/auto-generated/api-configs";
import { Payload } from "@/types";

export default function schemaValidator(
  payload: Payload | undefined,
  action: string,
  data: Record<string, unknown>,
): Record<string, unknown> {
  const _actionConfigItem = _actionConfig(action, payload);

  if (!payload) {
    return _parse(_actionConfigItem, data);
  }

  const _data = _decorate(
    _actionConfigItem,
    payload,
    _parse(_actionConfigItem, data),
  );

  _checkPolicies(_actionConfigItem, payload, _data);

  _checkPermission(payload, action);

  return _data satisfies Record<string, unknown>;
}

function _actionConfig(action: string, payload: Payload | undefined) {
  if (action in actionConfigs === false) {
    throw new Error(
      `Action ${action} is not defined in actionConfig`,
    );
  }
  const actionConfig = actionConfigs[
    action as Actions
  ] as ActionConfig;
  if (!actionConfig?.public && !payload?.id) {
    throw new Error("Unauthorized");
  }
  return actionConfig;
}

function _parse(
  actionConfig: ActionConfig,
  data: Record<string, unknown>,
) {
  const schema = actionConfig.schema.request;
  return schema.parse(data) as Record<string, unknown>;
}

function _decorate(
  actionConfig: ActionConfig,
  payload: Payload,
  data: Record<string, unknown>,
) {
  if (!actionConfig.decorator) {
    return data;
  }
  let decorators: RequestDecorator[] = [];
  if (Array.isArray(actionConfig.decorator)) {
    decorators = actionConfig.decorator;
  } else {
    decorators = [actionConfig.decorator];
  }
  return decorators.reduce(
    (data: Record<string, unknown>, decorator: RequestDecorator) => {
      return requestDecorators[decorator](payload, data);
    },
    data,
  );
}

function _checkPolicies(
  actionConfig: ActionConfig,
  payload: Payload,
  data: Record<string, unknown>,
) {
  if (!actionConfig.policy) {
    return;
  }
  let policies: Policy[] = [];
  if (Array.isArray(actionConfig.policy)) {
    policies = actionConfig.policy;
  } else {
    policies = [actionConfig.policy];
  }
  policies.forEach((policy) => {
    if (policyCheckers[policy](payload, data) === false) {
      throw new Error(`Policy ${policy} is not satisfied`);
    }
  });
}

function _checkPermission(payload: Payload, action: string) {
  if (payload.actionNames) {
    if (action && payload.actionNames.includes(action) === false) {
      throw new Error(`Action ${action} is not allowed`);
    }
    return;
  }
}
