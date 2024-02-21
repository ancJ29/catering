import { GenericObject, Payload } from "@/types";
import { z } from "zod";
import { RequestDecorator } from "./enums";

const schema = z
  .object({
    chainIds: z.string().array(),
    branchIds: z.string().array(),
    chainId: z.string(),
    branchId: z.string(),
  })
  .partial();

type RequestDecoratorHandler = (
  payload: Payload,
  data: GenericObject,
) => GenericObject;

export const decorators = {
  [RequestDecorator.ADD_BRANCH_IDS_AND_CHAIN_IDS]:
    addBranchIdsAndChainIds,
} satisfies Record<RequestDecorator, RequestDecoratorHandler>;

function addBranchIdsAndChainIds(
  payload: Payload,
  data: GenericObject,
) {
  const _data = schema.parse(data);
  if (!_data.chainId || !data.chainIds) {
    data.chainIds = payload.chainIds;
  }
  if (!_data.branchId || !data.branchIds) {
    data.branchIds = payload.branchIds;
  }
  return data;
}
