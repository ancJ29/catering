import {
  Actions,
  configs as actionConfigs,
  wrTypeSchema,
} from "@/auto-generated/api-configs";
import { loadAll } from "@/services/data-loaders";
import { OptionProps } from "@/types";
import {
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
} from "@/utils";
import { z } from "zod";

const response =
  actionConfigs[Actions.GET_WAREHOUSE_RECEIPTS].schema.response;

const warehouseReceiptSchema =
  response.shape.warehouseReceipts.transform((array) => array[0]);

export type WarehouseReceipt = z.infer<
  typeof warehouseReceiptSchema
> & {
  name: string;
};

export type WarehouseReceiptDetail =
  WarehouseReceipt["warehouseReceiptDetails"][0];

type GetWarehouseReceiptProps = {
  from?: number;
  to?: number;
};

export async function getAllWarehouseReceipts({
  from = startOfWeek(Date.now()),
  to = endOfWeek(Date.now()),
}: GetWarehouseReceiptProps): Promise<WarehouseReceipt[]> {
  const warehouseReceipts = await loadAll<WarehouseReceipt>({
    key: "warehouseReceipts",
    action: Actions.GET_WAREHOUSE_RECEIPTS,
    params: {
      from,
      to,
    },
  });
  return warehouseReceipts.map((el) => ({
    ...el,
    name: el.code,
  }));
}

export async function getWarehouseReceiptById(
  id: string,
): Promise<WarehouseReceipt | undefined> {
  const warehouseReceipts = await loadAll<WarehouseReceipt>({
    key: "warehouseReceipts",
    action: Actions.GET_WAREHOUSE_RECEIPTS,
    params: { id },
    noCache: true,
  });
  return warehouseReceipts.length ? warehouseReceipts[0] : undefined;
}

export async function getAllWarehouseExports(
  from = startOfMonth(Date.now()),
  to = endOfMonth(Date.now()),
): Promise<WarehouseReceipt[]> {
  return await loadAll<WarehouseReceipt>({
    key: "warehouseReceipts",
    action: Actions.GET_WAREHOUSE_EXPORTS,
    params: {
      from,
      to,
    },
  });
}

export async function getAllWarehouseImports(
  from = startOfMonth(Date.now()),
  to = endOfMonth(Date.now()),
): Promise<WarehouseReceipt[]> {
  return await loadAll<WarehouseReceipt>({
    key: "warehouseReceipts",
    action: Actions.GET_WAREHOUSE_IMPORTS,
    params: {
      from,
      to,
    },
  });
}

export function typeWarehouseOptions(t: (key: string) => string) {
  const statusOptions: OptionProps[] = wrTypeSchema.options.map(
    (type) => ({
      label: t(`warehouseReceipt.type.${type}`),
      value: type,
    }),
  );
  return [statusOptions];
}
