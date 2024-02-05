import { Payload } from "@/types";
import { Policy } from "./enums";

/*
Memo:
- Use this to check if a user has access to a resource
- For example, a user with role `chain manager` can only access resources that belong to the same chain
NOTICE:
- Don't check if a user has proper permissions to perform an action or not here
*/
type PolicyChecker = (payload: Payload, data: unknown) => boolean;

export const checkers = {} as Record<Policy, PolicyChecker>;
