import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import callApi from "@/services/api";
import { loadAll } from "@/services/data-loaders";
import useProductStore from "@/stores/product.store";
import { z } from "zod";

const response =
  actionConfigs[Actions.GET_CUSTOMER_PRODUCTS].schema.response;

const customerProductSchema =
  response.shape.customerProducts.transform((array) => array[0]);

export type CustomerProduct = z.infer<
  typeof customerProductSchema
> & {
  name: string;
};

export async function getCustomerProductsByCustomerId(
  customerId: string,
): Promise<CustomerProduct[]> {
  const { products } = useProductStore.getState();
  const customerProducts = await loadAll<CustomerProduct>({
    key: "customerProducts",
    action: Actions.GET_CUSTOMER_PRODUCTS,
    params: { customerId },
  });
  return customerProducts.map((cp) => ({
    ...cp,
    name: products.get(cp.productId)?.name || "",
  }));
}

const { request: updateRequest } =
  actionConfigs[Actions.UPDATE_CUSTOMER_PRODUCT].schema;
type UpdateRequest = z.infer<typeof updateRequest>;

export async function updateCustomerProduct(params: UpdateRequest) {
  await callApi<UpdateRequest, { id: string }>({
    action: Actions.UPDATE_CUSTOMER_PRODUCT,
    params,
    options: {
      toastMessage: "Your changes have been saved",
    },
  });
}
