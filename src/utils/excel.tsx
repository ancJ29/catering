// cspell:disable
import * as XLSX from "xlsx";
import { formatTime, getWeekNumber } from "./time";

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
}
