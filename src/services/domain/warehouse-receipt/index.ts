import {
  Actions,
  WRType,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import { loadAll } from "@/services/data-loaders";
import { endOfMonth, startOfMonth } from "@/utils";
import { z } from "zod";

const response =
  actionConfigs[Actions.GET_WAREHOUSE_EXPORTS].schema.response;

const warehouseReceiptSchema =
  response.shape.warehouseReceipts.transform((array) => array[0]);

export type WarehouseReceipt = z.infer<typeof warehouseReceiptSchema>;

export type WarehouseReceiptDetail =
  WarehouseReceipt["warehouseReceiptDetails"][0] & {
    date: Date;
    type: WRType;
    departmentId: string;
    supplierId?: string;
    cateringId?: string;
  };

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
