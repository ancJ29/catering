import { unitSchema } from "@/auto-generated/prisma-schema";
import { z } from "zod";
import {
  booleanSchema,
  dateSchema,
  nullishStringSchema,
  numberSchema,
  stringSchema,
} from "./schema";

export const productOthersSchema = z.object({
  type: z.enum([
    // cspell:disable
    "CP", // CHI PHÍ
    "KV", // Món ăn khai vị
    "C", // Canh
    "C_V", // Canh chay
    "R", // Cơm
    "M", // Mặn chính
    "A", // Món cải thiện
    "M_V", // Món chay chính
    "S_V", // Món nước phần ăn chay
    "S", // Món nước phần ăn mặn
    "L", // Luộc
    "D", // Tráng miệng
    "V", // Xào chay
    "A_P", // Tiệc - Món cải thiện
    "S_P", // Tiệc - Món nước (phần ăn mặn)
    "M_P", // Tiệc - Phần ăn mặn
    // cspell:enable
  ]),
});
export const departmentOthersSchema = z.object({
  iCenter: booleanSchema.default(true),
  totalSupplier: numberSchema.default(0),
  lastInventoryDate: dateSchema.nullish(),
  address: nullishStringSchema,
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

export const dailyMenuOthersSchema = z.object({
  targetName: stringSchema,
  shift: stringSchema,
});

export const supplierOthersSchema = z.object({
  contact: nullishStringSchema,
  email: nullishStringSchema,
  phone: nullishStringSchema,
  address: nullishStringSchema,
  caterings: z
    .object({
      cateringId: stringSchema,
      additionalFee: numberSchema,
    })
    .array()
    .optional(),
});

export const materialOthersSchema = z.object({
  id: numberSchema,
  group: z.enum([
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
  ]),
  type: z.enum([
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
  ]),
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
  expiryDays: numberSchema.default(7),
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
].reduce((acc, [type, group]) => {
  if (!acc[type]) {
    acc[type] = [];
  }
  acc[type].push(group);
  return acc;
}, {} as Record<string, string[]>);
