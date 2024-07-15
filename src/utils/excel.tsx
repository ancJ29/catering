import * as XLSX from "xlsx";
import { getWeekNumber } from "./time";

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
  fileName: string;
  sheetName?: string;
  targetName: string;
  customerName: string;
  headers: { label: string; timestamp?: number | undefined }[];
};

export function exportToMenuExcel({
  data,
  fileName,
  sheetName = "Sheet 1",
  targetName,
  customerName,
  headers,
}: ExportToMenuExcelProps) {
  // const worksheet = XLSX.utils.json_to_sheet(data);
  // const worksheetData = [...headers, ...data];
  console.log(headers);
  const weekNumber = getWeekNumber(headers[0].timestamp || 0);

  const worksheet = XLSX.utils.aoa_to_sheet([
    [
      `THỰC ĐƠN DÀNH CHO ${targetName} CỦA KHÁCH HÀNG ${customerName}`,
    ],
    // Áp dụng cho tuần 28 năm 2024 (08/07/2024~14/07/2024)
    [`Áp dụng cho tuần ${weekNumber} năm 2024 `],
    // ...worksheetData,
  ]);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  XLSX.writeFile(workbook, fileName);
}
