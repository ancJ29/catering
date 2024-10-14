// cspell:disable
import {
  ExportCateringExcelData,
  ExportSupplierExcelData,
} from "@/routes/purchase-order-management/_configs";
import logger from "@/services/logger";
import ExcelJS, { Font } from "exceljs";
import * as XLSX from "xlsx";
import { formatTime, getWeekNumber } from "./time";

const companyName = "CÔNG TY TNHH THẢO HÀ";
const boldFont: Partial<Font> = {
  name: "Calibri",
  size: 13,
  bold: true,
};
const normalFont: Partial<Font> = {
  name: "Calibri",
  size: 11,
};

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
  const workbook = new ExcelJS.Workbook();

  data.forEach((el) => {
    const { sheetName, cateringNames, date, title, items } = el;
    const worksheet = workbook.addWorksheet(sheetName);

    worksheet.addRow([companyName]).font = boldFont;
    const dateRow = worksheet.addRow([]);
    dateRow.getCell(1).value = "Ngày giao";
    dateRow.getCell(1).font = boldFont;

    dateRow.getCell(2).value = date;
    dateRow.getCell(2).font = normalFont;

    worksheet.addRow([title]).font = boldFont;
    worksheet.addRow([]);

    const headerRow = worksheet.addRow([
      "STT",
      "Tên Vật Tư",
      "ĐVT",
      "Tổng cộng",
      ...cateringNames,
      "Ghi chú",
    ]);
    headerRow.font = boldFont;
    headerRow.alignment = { horizontal: "center" };
    headerRow.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    items.forEach((item) => {
      const cateringAmounts = cateringNames.map(
        (cateringName) =>
          item.cateringQuantities[cateringName].toLocaleString() ||
          "-",
      );

      const row = worksheet.addRow([
        item.index,
        item.materialName,
        item.unit,
        item.totalAmount,
        ...cateringAmounts,
        item.note || "",
      ]);

      row.eachCell((cell) => {
        cell.font = normalFont;
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      row.getCell(1).alignment = { horizontal: "center" };
      row.getCell(3).alignment = { horizontal: "center" };
      row.getCell(4).alignment = { horizontal: "right" };
      row.getCell(4).font = boldFont;
      cateringAmounts.forEach((_, index) => {
        row.getCell(5 + index).alignment = { horizontal: "right" };
      });
    });
  });

  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `tong-hop${formatTime(
      deliveryDate,
      "YYYY/MM/DD",
    )}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
  });
}

export function exportToPOByCateringExcel(
  data: ExportCateringExcelData[],
) {
  const workbook = new ExcelJS.Workbook();

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

    const worksheet = workbook.addWorksheet(sheetName);

    worksheet.addRow([companyName]).font = {
      name: "Arial",
      size: 14,
      bold: true,
    };
    worksheet.addRow(["PHIẾU MUA HÀNG"]).font = {
      name: "Arial",
      size: 16,
      bold: true,
    };
    worksheet.addRow(["Mã", purchaseOrderCode]);
    worksheet.addRow(["Ngày nhận", date]);
    worksheet.addRow(["Bếp", cateringName]);
    worksheet.addRow(["Nhà cung cấp", supplierName]);
    worksheet.addRow(["Địa chỉ nhận", address]);
    worksheet.addRow([]);

    const headerRow = worksheet.addRow([
      "STT",
      "Mã Vật Tư",
      "Tên Vật Tư",
      "ĐVT",
      "Đặt",
      "Nhận",
      "Thanh toán",
      "Ghi chú cho NCC",
    ]);
    headerRow.font = { name: "Arial", size: 12, bold: true };

    items.forEach((item) => {
      worksheet.addRow([
        item.index,
        item.materialCode,
        item.materialName,
        item.unit,
        item.orderAmount,
        item.receivedAmount,
        item.paymentAmount,
        item.note,
      ]);
    });
  });

  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = "DON-DAT-HANG.xlsx";
    link.click();
    URL.revokeObjectURL(url);
  });
}
