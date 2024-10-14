// cspell:disable
import {
  ExportCateringExcelData,
  ExportSupplierExcelData,
} from "@/routes/purchase-order-management/_configs";
import logger from "@/services/logger";
import * as XLSX from "xlsx";
import { formatTime, getWeekNumber } from "./time";

const companyName = "CÔNG TY TNHH THẢO HÀ";

export function processExcelFile<T>(
  file: File,
  mapRowToData: (row: string[]) => T,
  callback: (data: T[]) => void,
) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const binaryStr = event.target?.result as string;
    const workbook = XLSX.read(binaryStr, { type: "binary" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    const jsonData = XLSX.utils.sheet_to_json<string[]>(worksheet, {
      header: 1,
    });
    const processedData = (jsonData as string[][])
      .map(mapRowToData)
      .filter((row) => row);

    callback(processedData);
  };
  reader.readAsArrayBuffer(file);
}

type ExportToMenuExcelProps = {
  data: string[];
  sheetName?: string;
  targetName: string;
  customerName: string;
  headers: { label: string; timestamp?: number | undefined }[];
};

export function exportToMenuExcel({
  data,
  sheetName = "Sheet 1",
  targetName,
  customerName,
  headers,
}: ExportToMenuExcelProps) {
  const firstDayOfWeek = headers[0].timestamp || 0;
  const lastDayOfWeek = headers[headers.length - 1].timestamp || 0;
  const weekNumber = getWeekNumber(firstDayOfWeek);

  const worksheet = XLSX.utils.aoa_to_sheet([
    [
      `THỰC ĐƠN DÀNH CHO ${targetName} CỦA KHÁCH HÀNG ${customerName}`,
    ],
    [
      `Áp dụng cho tuần ${weekNumber} năm ${formatTime(
        firstDayOfWeek,
        "YYYY",
      )} (${formatTime(firstDayOfWeek, "DD/MM/YYYY")}~${formatTime(
        lastDayOfWeek,
        "DD/MM/YYYY",
      )}})`,
    ],
  ]);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  XLSX.writeFile(
    workbook,
    `ThucDonTuan_${weekNumber}_${formatTime(
      firstDayOfWeek,
      "YYYY",
    )}.xlsx`,
  );

  logger.info(data);
}

export function exportToPOBySupplierExcel(
  data: ExportSupplierExcelData[],
  deliveryDate: Date,
) {
  const workbook = XLSX.utils.book_new();
  data.forEach((el) => {
    const { sheetName, cateringNames, date, title, items } = el;
    const worksheetData = [
      [
        {
          v: companyName,
          s: { font: { name: "Arial", sz: 13, bold: true } },
        },
      ],
      ["Ngày giao", date],
      [title],
      [],
      [
        "STT",
        "Tên Vật Tư",
        "ĐVT",
        "Tổng cộng",
        ...cateringNames,
        "Ghi chú",
      ],
    ];

    items.forEach((item) => {
      const cateringAmounts = cateringNames.map((cateringName) =>
        String(item.cateringQuantities[cateringName] || "-"),
      );

      worksheetData.push([
        String(item.index),
        item.materialName,
        item.unit,
        String(item.totalAmount),
        ...cateringAmounts,
        item.note || "",
      ]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  });

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = `tong-hop${formatTime(
    deliveryDate,
    "YYYY/MM/DD",
  )}.xlsx`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToPOByCateringExcel(
  data: ExportCateringExcelData[],
) {
  const workbook = XLSX.utils.book_new();
  data.forEach((el) => {
    const {
      sheetName,
      purchaseOrderCode,
      date,
      cateringName,
      supplierName,
      address,
      items,
    } = el;
    const worksheetData = [
      [companyName],
      ["PHIẾU MUA HÀNG"],
      ["Mã", purchaseOrderCode],
      ["Ngày nhận", date],
      ["Bếp", cateringName],
      ["Nhà cung cấp", supplierName],
      ["Địa chỉ nhận", address],
      [],
      [
        "STT",
        "Mã Vật Tư",
        "Tên Vật Tư",
        "ĐVT",
        "Đặt",
        "Nhận",
        "Thanh toán",
        "Ghi chú cho NCC",
      ],
    ];

    items.forEach((item) => {
      worksheetData.push([
        String(item.index),
        item.materialCode,
        item.materialName,
        item.unit,
        String(item.orderAmount),
        String(item.receivedAmount),
        String(item.paymentAmount),
        item.note,
      ]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  });

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = "DON-DAT-HANG.xlsx";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
