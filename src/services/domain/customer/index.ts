import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import cache from "@/services/cache";
import { loadAll } from "@/services/data-loaders";
import logger from "@/services/logger";
import { z } from "zod";

const response = actionConfigs[Actions.GET_CUSTOMERS].schema.response;

const customerSchema = response.shape.customers.transform(
  (array) => array[0],
);

const schema = response.omit({ cursor: true, hasMore: true });

export type Customer = z.infer<typeof customerSchema>;

export async function getAllCustomers(): Promise<Customer[]> {
  const key = "domain.customer.getAllCustomers";
  if (cache.has(key)) {
    const res = schema.safeParse(cache.get(key));
    if (res.success) {
      logger.debug("cache hit", key);
      return res.data.customers;
    }
  }
  const customers = await loadAll<Customer>({
    key: "customers",
    action: Actions.GET_CUSTOMERS,
  });
  cache.set(key, { customers });
  return customers;
}
