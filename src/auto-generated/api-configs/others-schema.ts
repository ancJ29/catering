import { z } from "zod";
import { dateSchema } from "./schema";

export const departmentOthersSchema = z.object({
  iCenter: z.boolean().default(true),
  totalSupplier: z.number().default(0),
  lastInventoryDate: dateSchema.nullish(),
});

export const customerOthersSchema = z.object({
  cateringId: z.string(),
  cateringName: z.string(),
  type: z.enum(["company"]),
  targets: z
    .object({
      name: z.string(),
      shifts: z.string().array(),
    })
    .array(),
});

export const dailyMenuOthersSchema = z.object({
  targetName: z.string(),
  shift: z.string(),
});

export const supplierOthersSchema = z.object({
  contact: z.string().nullish(),
  email: z.string().nullish(),
  phone: z.string().nullish(),
  address: z.string().nullish(),
});

export const materialOthersSchema = z.object({
  id: z.number(),
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
  unit: z.string(),
  purchasingUnit: z.string().optional(),
  converter: z.number().optional().default(1),
  expiryDays: z.number().default(7),
});
