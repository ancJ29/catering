import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import callApi from "@/services/api";
import cache from "@/services/cache";
import { loadAll } from "@/services/data-loaders";
import logger from "@/services/logger";
import { z } from "zod";

const response = actionConfigs[Actions.GET_CUSTOMERS].schema.response;

const customerSchema = response.shape.customers.transform(
  (array) => array[0],
);

const targetSchema = actionConfigs[
  Actions.GET_CUSTOMERS
].schema.response.shape.customers
  .transform((array) => {
    return array[0].others.targets;
  })
  .transform((array) => array[0]);

export type Target = z.infer<typeof targetSchema>;

const schema = response.omit({ cursor: true, hasMore: true });

export type Customer = z.infer<typeof customerSchema>;

export async function getAllCustomers(
  noCache = false,
): Promise<Customer[]> {
  const key = "domain.customer.getAllCustomers";
  if (!noCache && cache.has(key)) {
    const res = schema.safeParse(cache.get(key));
    if (res.success) {
      logger.trace("cache hit", key);
      return res.data.customers;
    }
  }
  const customers = await loadAll<Customer>({
    key: "customers",
    action: Actions.GET_CUSTOMERS,
    noCache,
  });
  cache.set(key, { customers });
  return customers;
}

const { request: addRequest } =
  actionConfigs[Actions.ADD_CUSTOMER].schema;
type AddRequest = z.infer<typeof addRequest>;

export async function addCustomer(params: AddRequest) {
  return await callApi<AddRequest, { id: string }>({
    action: Actions.ADD_CUSTOMER,
    params,
    options: {
      toastMessage: "Add successfully",
    },
  });
}

const { request: updateRequest } =
  actionConfigs[Actions.UPDATE_CUSTOMER].schema;
type UpdateRequest = z.infer<typeof updateRequest>;

export async function updateCustomer(params: UpdateRequest) {
  await callApi<UpdateRequest, { id: string }>({
    action: Actions.UPDATE_CUSTOMER,
    params,
    options: {
      toastMessage: "Your changes have been saved",
    },
  });
}
