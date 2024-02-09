import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import { z } from "zod";
const customersSchema = actionConfigs[
  Actions.GET_CUSTOMERS
].schema.response.shape.customers;

const productSchema = actionConfigs[
  Actions.GET_PRODUCTS
].schema.response.shape.products.transform(
  (array) => array[0],
);

const customerSchema = customersSchema.transform((array) => array[0]);

export const targetSchema = customersSchema.transform((array) => {
  return array[0].others.targets;
}).transform((array) => array[0]);

export type Target = z.infer<typeof targetSchema>;

export type Customer = z.infer<typeof customerSchema>;

export type Product = z.infer<typeof productSchema>;
