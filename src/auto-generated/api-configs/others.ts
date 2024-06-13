import { unitSchema } from "@/auto-generated/prisma-schema";
import { z } from "zod";
import {
  booleanSchema,
  dateSchema,
  nullishStringSchema,
  numberSchema,
  optionalBooleanSchema,
  optionalNumberSchema,
  optionalStringSchema,
  stringSchema,
} from "./schema";

export enum ClientRoles {
  OWNER = "owner",
  MANAGER = "manager",
  PRODUCTION = "production",
  PURCHASING = "purchasing",
  CATERING = "catering",
  ACCOUNTING = "accounting",
  SUPPLIER = "supplier",
}

const roleSchema = z.enum([
  ClientRoles.OWNER,
  ClientRoles.MANAGER,
  ClientRoles.PRODUCTION,
  ClientRoles.PURCHASING,
  ClientRoles.CATERING,
  ClientRoles.ACCOUNTING,
  ClientRoles.SUPPLIER,
]);

export const userOthersSchema = z.object({
  roles: roleSchema.array(),
});

export const productCategorySchema = z.enum([
  // cspell:disable
  "O", // Loại hình khác (Mã Nhóm Loại: 4)
  "D", // Suất ăn hàng ngày (2)
  "P", // Tiệc (1)
  // cspell:enable
]);

export const productTypeSchema = z.enum([
  // cspell:disable
  "CP", // CHI PHÍ
  "KV", // Món ăn khai vị
  "CM", // Canh
  "CA", // Canh chay
  "CO", // Cơm
  "MC", // Mặn chính
  "CT", // Món cải thiện
  "CC", // Món chay chính
  "NC", // Món nước phần ăn chay
  "NM", // Món nước phần ăn mặn
  "LU", // Rau củ xào, luộc
  "TM", // Tráng miệng
  "XC", // Xào chay
  "CT1", // Tiệc - Món cải thiện
  "NM1", // Tiệc - Món nước (phần ăn mặn)
  "MC1", // Tiệc - Phần ăn mặn
  // cspell:enable
]);

export const productTypeOrders: Record<string, number> = {
  MC: 1,
  LU: 2,
  CO: 3,
  CM: 4,
  CC: 5,
  XC: 6,
  CA: 7,
  NC: 8,
  NM: 9,
  TM: 10,
  CT: 11,
  KV: 12,
  CT1: 13,
  NM1: 14,
  MC1: 15,
  CP: 16,
};

export const productOthersSchema = z.object({
  oldId: numberSchema,
  internalCode: stringSchema,
  costPrice: optionalNumberSchema.default(0),
  costPriceByCatering: z
    .record(stringSchema, numberSchema)
    .optional()
    .default({}),
  type: productTypeSchema,
  category: productCategorySchema,
  party: booleanSchema.default(true),
  normal: booleanSchema.default(true),
  supply: booleanSchema.default(true),
});

export const departmentOthersSchema = z.object({
  role: roleSchema,
  isCenter: optionalBooleanSchema,
  hasInventory: optionalBooleanSchema,
  totalSupplier: numberSchema.default(0),
  lastInventoryDate: dateSchema.nullish(),
  address: nullishStringSchema,
});

export const inventoryOthersSchema = z.object({
  memo: optionalStringSchema,
  materialInternalCode: stringSchema,
});

export const customerOthersSchema = z.object({
  cateringId: stringSchema,
  cateringName: stringSchema,
  type: z.enum(["company"]),
  targets: z
    .object({
      name: stringSchema,
      shifts: stringSchema.array(),
    })
    .array(),
});

export const dailyMenuStatusSchema = z.enum([
  // cspell:disable
  "NEW", // Chưa xác nhận số lượng
  "WAITING", // Chờ bếp xác nhận
  "CONFIRMED", // Đã xác nhận
  "PROCESSING", // Bếp đang chuẩn bị
  "READY", // Sẵn sàng giao
  "DELIVERED", // Đã giao
  // cspell:enable
]);

export const dailyMenuOthersSchema = z.object({
  price: optionalNumberSchema,
  cateringId: stringSchema,
  targetName: stringSchema,
  shift: stringSchema,
  total: optionalNumberSchema.default(0),
  quantity: z.record(stringSchema, numberSchema),
  status: dailyMenuStatusSchema.default("NEW"),
  itemByType: z.record(productTypeSchema, numberSchema).optional(),
});

export const supplierOthersSchema = z.object({
  active: optionalBooleanSchema.default(true),
  email: nullishStringSchema,
  phone: nullishStringSchema,
  address: nullishStringSchema,
  taxCode: nullishStringSchema,
  caterings: z
    .object({
      cateringId: stringSchema,
      additionalFee: numberSchema,
    })
    .array()
    .optional(),
});

const materialTypeSchema = z.enum([
  // cspell:disable
  "BS", // "Bánh sữa trái cây tráng miệng",
  "BTBDKD", // "Bảo Trì,Bảo Dưỡng,Kiểm định",
  "KH", // "Chi phí tiêu hao khác",
  "CCDC", // "Công Cụ Dụng Cụ",
  "GB", // "Gạo bún",
  "VG", // "Gia vị",
  "NTNV", // "Nhà Trọ,Nhân Viên",
  "GA", // "Nhiên liệu",
  "RCQ", // "Rau củ quả",
  "TCT", // "Thịt cá trứng",
  "TTB", // "Trang Thiết Bị",
  "VPP", // "Văn Phòng Phẩm",
  "YT", // "Y tế",
  "DC", // "Đồ chay",
  "DP", // "Đồng Phục",
  // cspell:enable
]);

const materialGroupSchema = z.enum([
  // cspell:disable
  "D", // Bánh sữa
  "M", // Trái cây, chè tráng miệng
  "L", // Bảo Trì,Bảo Dưỡng,Kiểm định
  "K", // Chi Phí SX Khác
  "X", // Công Cụ Dụng Cụ
  "O", // Bún, mì, hủ tiếu
  "E", // Gạo, nếp
  "V", // Gia vị
  "Ư", // Nhà Trọ,Nhân Viên
  "F", // Củi
  "A", // Gas
  "R", // Rau củ nấu thực phẩm
  "C", // Cá các loại
  "S", // Hải sản khác
  "B", // Thịt bò các loại
  "G", // Thịt gà, vịt các loại
  "H", // Thịt heo các loại
  "T", // Trứng các loại
  "I", // Trang Thiết Bị
  "N", // Văn Phòng Phẩm
  "Y", // Y Tế,ATVSTP
  "Z", // Đồ chay
  "P", // Đồng Phục
  // cspell:enable
]);

export const materialOrderCycleSchema = z.enum([
  // cspell:disable
  "HN", // Hằng ngày
  "DK", // Định kỳ
  // cspell:enable
]);

export const materialOthersSchema = z.object({
  oldId: numberSchema,
  internalCode: stringSchema,
  group: materialGroupSchema,
  type: materialTypeSchema,
  price: optionalNumberSchema,
  prices: z.record(stringSchema, numberSchema).optional(),
  orderCycle: materialOrderCycleSchema,
  allowFloat: booleanSchema,
  /*
    Unit:
      [kg, g] => [1000] ~ 1kg = 1000g
      // cspell:disable-next-line
      [Thùng, Hộp, Bịch] => [12, 24] ~ 1 thùng = 12 hộp = 12 x 24 bịch
  */

  unit: unitSchema
    .pick({
      name: true,
      units: true,
      converters: true,
    })
    .extend({
      unitId: stringSchema,
    })
    .optional(),
  expiryDays: optionalNumberSchema,
});

export const materialGroupByType = [
  ["BS", "D"],
  ["BS", "M"],
  /* cspell:disable-next-line */
  ["BTBDKD", "L"],
  ["KH", "K"],
  /* cspell:disable-next-line */
  ["CCDC", "X"],
  ["GB", "O"],
  ["GB", "E"],
  ["VG", "V"],
  /* cspell:disable-next-line */
  ["NTNV", "Ư"],
  ["GA", "F"],
  ["GA", "A"],
  ["RCQ", "R"],
  ["TCT", "C"],
  ["TCT", "S"],
  ["TCT", "B"],
  ["TCT", "G"],
  ["TCT", "H"],
  ["TCT", "T"],
  ["TTB", "I"],
  ["VPP", "N"],
  ["YT", "Y"],
  ["DC", "Z"],
  ["DP", "P"],
].reduce(
  (acc, [type, group]) => {
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(group);
    return acc;
  },
  {} as Record<string, string[]>,
);

export const bomOthersSchema = z.object({
  /*
    ${customerId}.${target}.${shift}
      <materialId>: <amount>
  */
  customized: z
    .record(stringSchema, z.record(stringSchema, numberSchema))
    .default({}),
  memo: z.record(stringSchema, stringSchema).optional(),
});

export const prStatusSchema = z.enum([
  // cspell:disable
  "DG", // Đã gửi
  "DD", // Đã duyệt
  "KD", // Không duyệt
  "DDP", // Đang điều phối
  "MH", // Mua hàng
  "DNH", // Đang nhận hàng
  "NH", // Đã nhận hàng
  "DH", // Đã huỷ
  // cspell:enable
]);

export const prTypeSchema = z.enum([
  // cspell:disable
  "HN", // Hằng ngày
  "DK", // Định kỳ
  // cspell:enable
]);

export const prPrioritySchema = z.enum([
  // cspell:disable
  "BT", // Bình thường
  "KC", // Khẩn cấp
  // cspell:enable
]);

export const purchaseRequestOthersSchema = z.object({
  status: prStatusSchema,
  type: prTypeSchema,
  priority: prPrioritySchema,
});

export const purchaseRequestDetailOthersSchema = z.object({
  price: numberSchema,
  supplierNote: nullishStringSchema,
  internalNote: nullishStringSchema,
});

export const poStatusSchema = z.enum([
  // cspell:disable
  "CXL", // Chờ xử lý
  "CPH", // Chờ NCC phản hồi
  "PH", // NCC có phản hồi
  "SSGH", // NCC sẵn sàng giao hàng
  "DGH", // NCC đã giao hàng
  "NK1P", // Nhập kho 1 phần
  "DNK", // Đã nhập kho
  "DKT", // Đã kiểm tra sai lệch
  "DTDNTT", // Đã tạo đề nghị thanh toán
  // cspell:enable
]);

export const purchaseOrderOthersSchema = z.object({
  type: prTypeSchema,
  priority: prPrioritySchema,
  status: poStatusSchema,
  departmentId: nullishStringSchema,
});

export const purchaseOrderDetailOthersSchema = z.object({
  supplierNote: nullishStringSchema,
  internalNote: nullishStringSchema,
  price: numberSchema,
  taxRate: numberSchema,
  unitId: nullishStringSchema,
});

export type ProductType = z.infer<typeof productTypeSchema>;
export type ProductCategory = z.infer<typeof productCategorySchema>;
export type MaterialType = z.infer<typeof materialTypeSchema>;
export type MaterialGroup = z.infer<typeof materialGroupSchema>;
export type MaterialOrderCycle = z.infer<typeof materialOrderCycleSchema>;
export type DailyMenuStatus = z.infer<typeof dailyMenuStatusSchema>;
export type PRType = z.infer<typeof prTypeSchema>;
export type PRPriority = z.infer<typeof prPrioritySchema>;
export type PRStatus = z.infer<typeof prStatusSchema>;
export type POStatus = z.infer<typeof poStatusSchema>;
