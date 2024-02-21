import { UserRole } from "@/auto-generated/prisma-schema";
import { Payload } from "@/types";
import { isSubArray } from "@/utils";
import { z } from "zod";
import { Policy } from "./enums";

/*
Memo:
- Use this to check if a user has access to a resource
- For example, a user with role `chain manager` can only access resources that belong to the same chain
NOTICE:
- Don't check if a user has proper permissions to perform an action or not here
*/
type PolicyChecker = (payload: Payload, data: unknown) => boolean;

const chainSchema = z
  .object({
    chainId: z.string(),
    chainIds: z.string().array(),
  })
  .partial();
const branchSchema = z
  .object({
    branchId: z.string(),
    branchIds: z.string().array(),
  })
  .partial();

export const checkers = {
  [Policy.SAME_CHAIN]: _checkSameChain,
  [Policy.SAME_BRANCH]: _checkSameBranch,
  [Policy.SAME_CHAIN_IF_CHAIN_MANAGER]: (
    payload: Payload,
    data: unknown,
  ) => {
    if (payload.role === UserRole.CHAIN_MANAGER) {
      return _checkSameChain(payload, data);
    }
    return true;
  },
  [Policy.SAME_BRANCH_IF_BRANCH_MANAGER]: (
    payload: Payload,
    data: unknown,
  ) => {
    if (payload.role === UserRole.MANAGER) {
      return _checkSameBranch(payload, data);
    }
    return true;
  },
} satisfies Record<Policy, PolicyChecker>;

function _checkSameChain(payload: Payload, data: unknown) {
  const { chainId, chainIds } = chainSchema.parse(data);
  if (chainId) {
    return payload.chainIds.includes(chainId);
  }
  if (chainIds) {
    return isSubArray(payload.chainIds, chainIds);
  }
  return false;
}

function _checkSameBranch(payload: Payload, data: unknown) {
  const { branchId, branchIds } = branchSchema.parse(data);
  if (branchId) {
    return payload.branchIds.includes(branchId);
  }
  if (branchIds) {
    return isSubArray(payload.branchIds, branchIds);
  }
  return false;
}
