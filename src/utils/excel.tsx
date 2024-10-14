// cspell:disable
import {
  ExportCateringExcelData,
  ExportSupplierExcelData,
} from "@/routes/purchase-order-management/_configs";
import logger from "@/services/logger";
import ExcelJS, { Borders, Font } from "exceljs";
import * as XLSX from "xlsx";
import { formatTime } from "./time";

const companyName = "CÔNG TY TNHH THẢO HÀ";
const boldFont11: Partial<Font> = {
  name: "Calibri",
  size: 11,
  bold: true,
};
const boldFont13: Partial<Font> = {
  name: "Calibri",
  size: 13,
  bold: true,
};
const boldFont16: Partial<Font> = {
  name: "Calibri",
  size: 16,
  bold: true,
};
const normalFont: Partial<Font> = {
  name: "Calibri",
  size: 11,
};
const thinBorders: Partial<Borders> = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};
const centerAlign: Partial<ExcelJS.Alignment> = {
  horizontal: "center",
  vertical: "middle",
  wrapText: true,
};
const rightAlign: Partial<ExcelJS.Alignment> = {
  horizontal: "right",
  vertical: "middle",
  wrapText: true,
};
const leftAlign: Partial<ExcelJS.Alignment> = {
  horizontal: "left",
  vertical: "middle",
  wrapText: true,
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
}: // sheetName = "Sheet 1",
// targetName,
// customerName,
// headers,
ExportToMenuExcelProps) {
  // const firstDayOfWeek = headers[0].timestamp || 0;
  // const lastDayOfWeek = headers[headers.length - 1].timestamp || 0;
  // const weekNumber = getWeekNumber(firstDayOfWeek);

  // const worksheet = XLSX.utils.aoa_to_sheet([
  //   [
  //     `THỰC ĐƠN DÀNH CHO ${targetName} CỦA KHÁCH HÀNG ${customerName}`,
  //   ],
  //   [
  //     `Áp dụng cho tuần ${weekNumber} năm ${formatTime(
  //       firstDayOfWeek,
  //       "YYYY",
  //     )} (${formatTime(firstDayOfWeek, "DD/MM/YYYY")}~${formatTime(
  //       lastDayOfWeek,
  //       "DD/MM/YYYY",
  //     )}})`,
  //   ],
  // ]);

  // const workbook = XLSX.utils.book_new();

  // XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // XLSX.writeFile(
  //   workbook,
  //   `ThucDonTuan_${weekNumber}_${formatTime(
  //     firstDayOfWeek,
  //     "YYYY",
  //   )}.xlsx`,
  // );

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
    worksheet.views = [
      {
        state: "frozen",
        xSplit: 4,
        ySplit: 4,
      },
    ];
    worksheet.addRow([companyName]).font = boldFont13;
    const dateRow = worksheet.addRow([]);
    dateRow.getCell(1).value = "Ngày giao";
    dateRow.getCell(1).font = boldFont13;
    dateRow.getCell(2).value = date;
    dateRow.getCell(2).font = normalFont;
    worksheet.addRow([title]).font = boldFont13;
    worksheet.addRow([]);

    const headerRow = worksheet.addRow([
      "STT",
      "Tên Vật Tư",
      "ĐVT",
      "Tổng cộng",
      ...cateringNames,
      "Ghi chú",
    ]);
    headerRow.font = boldFont13;
    headerRow.alignment = centerAlign;
    headerRow.eachCell((cell) => {
      cell.border = thinBorders;
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
        item.totalAmount.toLocaleString(),
        ...cateringAmounts,
        item.note || "",
      ]);
      row.eachCell((cell) => {
        cell.font = normalFont;
        cell.border = thinBorders;
      });
      row.getCell(1).alignment = centerAlign;
      row.getCell(2).alignment = leftAlign;
      row.getCell(3).alignment = centerAlign;
      row.getCell(4).alignment = rightAlign;
      row.getCell(4).font = boldFont13;
      cateringAmounts.forEach((_, index) => {
        row.getCell(5 + index).alignment = rightAlign;
      });
      row.getCell(5 + cateringNames.length).alignment = leftAlign;
      worksheet.getColumn(1).width = 12;
      worksheet.getColumn(2).width = 35;
      worksheet.getColumn(3).width = 8;
      worksheet.getColumn(4).width = 9;
      cateringNames.forEach((_, index) => {
        worksheet.getColumn(5 + index).width = 9;
      });
      worksheet.getColumn(5 + cateringNames.length).width = 40;
    });
  });

  saveWorkbook(
    workbook,
    `tong-hop${formatTime(deliveryDate, "YYYY/MM/DD")}.xlsx`,
  );
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
    worksheet.views = [
      {
        state: "frozen",
        xSplit: 0,
        ySplit: 10,
      },
    ];

    setCell(worksheet, "A1:H1", companyName, boldFont11, leftAlign);
    setCell(
      worksheet,
      "A2:H2",
      "PHIẾU MUA HÀNG",
      boldFont16,
      centerAlign,
    );
    mergeAndSetCell(
      worksheet,
      "B3:C3",
      "Mã",
      "D3:H3",
      purchaseOrderCode,
    );
    mergeAndSetCell(worksheet, "B4:C4", "Ngày nhận", "D4:H4", date);
    mergeAndSetCell(worksheet, "B5:C5", "Bếp", "D5:H5", cateringName);
    mergeAndSetCell(
      worksheet,
      "B6:C6",
      "Nhà cung cấp",
      "D6:H6",
      supplierName,
    );
    mergeAndSetCell(
      worksheet,
      "B7:C7",
      "Địa chỉ nhận",
      "D7:H7",
      address,
    );
    worksheet.addRow([]);

    header(worksheet);

    items.forEach((item) => {
      const row = worksheet.addRow([
        item.index,
        item.materialCode,
        item.materialName,
        item.unit,
        item.orderAmount.toLocaleString(),
        item.receivedAmount.toLocaleString(),
        item.paymentAmount.toLocaleString(),
        item.note,
      ]);
      row.eachCell((cell) => {
        cell.font = normalFont;
        cell.border = thinBorders;
      });
      row.getCell(1).alignment = centerAlign;
      row.getCell(2).alignment = leftAlign;
      row.getCell(3).alignment = leftAlign;
      row.getCell(4).alignment = centerAlign;
      row.getCell(5).alignment = rightAlign;
      row.getCell(6).alignment = rightAlign;
      row.getCell(7).alignment = rightAlign;
      row.getCell(8).alignment = leftAlign;
    });
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 10;
    worksheet.getColumn(3).width = 30;
    worksheet.getColumn(4).width = 10;
    worksheet.getColumn(5).width = 12;
    worksheet.getColumn(6).width = 12;
    worksheet.getColumn(7).width = 14;
    worksheet.getColumn(8).width = 30;
  });

  saveWorkbook(workbook, "DON_DAT_HANG.xlsx");

  function header(worksheet: ExcelJS.Worksheet) {
    setCell(
      worksheet,
      "A9:A10",
      "STT",
      boldFont13,
      centerAlign,
      thinBorders,
    );
    setCell(
      worksheet,
      "B9:B10",
      "Mã VT",
      boldFont13,
      centerAlign,
      thinBorders,
    );
    setCell(
      worksheet,
      "C9:C10",
      "Tên Vật Tư",
      boldFont13,
      centerAlign,
      thinBorders,
    );
    setCell(
      worksheet,
      "D9:D10",
      "ĐVT",
      boldFont13,
      centerAlign,
      thinBorders,
    );

    setCell(
      worksheet,
      "E9:G9",
      "Số lượng",
      boldFont13,
      centerAlign,
      thinBorders,
    );

    setCell(
      worksheet,
      "E10",
      "Đặt",
      boldFont13,
      centerAlign,
      thinBorders,
    );
    setCell(
      worksheet,
      "F10",
      "Nhận",
      boldFont13,
      centerAlign,
      thinBorders,
    );
    setCell(
      worksheet,
      "G10",
      "Thanh toán",
      boldFont13,
      centerAlign,
      thinBorders,
    );

    setCell(
      worksheet,
      "H9:H10",
      "Ghi chú cho NCC",
      boldFont13,
      centerAlign,
      thinBorders,
    );
  }

  function mergeAndSetCell(
    worksheet: ExcelJS.Worksheet,
    rangeTitle: string,
    title: string,
    rangeValue: string,
    value: string,
  ) {
    setCell(worksheet, rangeTitle, title, boldFont11, leftAlign);
    setCell(worksheet, rangeValue, value, boldFont11, leftAlign);
  }

  function setCell(
    worksheet: ExcelJS.Worksheet,
    rangeValue: string,
    value: string,
    font: Partial<ExcelJS.Font>,
    alignment: Partial<ExcelJS.Alignment>,
    border?: Partial<Borders>,
  ) {
    worksheet.mergeCells(rangeValue);
    const cellAddress = rangeValue.split(":")[0];
    const cell = worksheet.getCell(cellAddress);
    cell.value = value;
    cell.font = font;
    cell.alignment = alignment;
    cell.border = border ?? {};
  }
}

function saveWorkbook(workbook: ExcelJS.Workbook, fileName: string) {
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  });
}
