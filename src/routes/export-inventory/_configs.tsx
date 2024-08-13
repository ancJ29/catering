import { WRType } from "@/auto-generated/api-configs";
import { z } from "zod";

export const caseSchema = z.enum([
  "Released from warehouse",
  "Warehouse transfer",
]);
export type Case = z.infer<typeof caseSchema>;

export const typeSchema = z.enum([
  "Manual export",
  "Quantitative export",
  "Export on demand",
]);
export type Type = z.infer<typeof typeSchema>;

export const caseByType = [
  ["Released from warehouse", "Manual export"],
  ["Released from warehouse", "Quantitative export"],
  ["Warehouse transfer", "Export on demand"],
].reduce((acc, [type, group]) => {
  if (!acc[type]) {
    acc[type] = [];
  }
  acc[type].push(group);
  return acc;
}, {} as Record<string, string[]>);

export const initialExportInventoryForm: ExportInventoryForm = {
  case: caseSchema.Values["Released from warehouse"],
  type: null,
  date: new Date(),
};

export type ExportInventoryForm = {
  case: Case;
  type: Type | null;
  date: Date;
};

export type ExportReceipt = {
  date: Date;
  receivingDate?: Date;
  departmentId: string;
  type?: WRType | null;
  receivingCateringId?: string;
};

export type ExportDetail = {
  name: string;
  materialId: string;
  amount: number;
  price: number;
  memo: string;
};

export enum Tab {
  STANDARD = "standard",
  EXPORT = "export",
}

export function casesAndTypes(
  caseByType: Record<string, string[]>,
  case_: string | null,
) {
  const cases: string[] = Object.keys(caseByType).map(
    (_case) => _case,
  );
  let types: string[] = [];
  if (case_ && case_ in caseByType) {
    types = Object.values(caseByType[case_]).map((type) => type);
  } else {
    types = Object.values(caseByType)
      .map((e) => Object.values(e))
      .flat()
      .map((type) => type);
  }
  return [cases, types];
}
