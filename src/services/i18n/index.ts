import en from "@/auto-generated/api-configs/translation/en";
import vi from "@/auto-generated/api-configs/translation/vi";
import { Dictionary } from "@/types";

export const dictionaryList: Record<string, Dictionary> = {
  en: {
    ...en,
    "Supply Coordination": "Supply Coordination",
    "Payment Request": "Payment Request",
    "Cost Assignment": "Cost Assignment",
    "Invoice Management": "Invoice Management",
    "HRM Management": "HRM Management",
    "Employee Management": "Employee Management",
    "Department Management": "Department Management",
    "Position Management": "Position Management",
    "Inventory Management": "Inventory Management",
    "Check Inventory": "Check Inventory",
    "Import-Export": "Import-Export",
    "Sales Report": "Sales Report",
    "Debt Report": "Debt Report",
    "Import - Export Report": "Import - Export Report",
    "System Settings": "System Settings",
    "Login History": "Login History",
    "Access Authorization": "Access Authorization",
    "Function Management": "Function Management",
  },
  vi: {
    ...vi,
    // cspell:disable
    "Supply Coordination": "Điều phối nguồn cung",
    "Payment Request": "Lập đề nghị thanh toán",
    "Cost Assignment": "Phân bổ chi phí",
    "Invoice Management": "Quản lý hóa đơn",
    "HRM Management": "Quản lý nhân sự",
    "Employee Management": "Quản lý nhân viên",
    "Department Management": "Quản lý phòng ban",
    "Position Management": "Quản lý chức vụ",
    "Inventory Management": "Quản lý kho",
    "Check Inventory": "Kiểm kê kho",
    "Import-Export": "Xuất - nhập kho",
    "Sales Report": "Báo cáo doanh thu",
    "Debt Report": "Báo cáo công nợ",
    "Import - Export Report": "Báo cáo xuất - nhập kho",
    "System Settings": "Cài đặt hệ thống",
    "Login History": "Lịch sử đăng nhập",
    "Access Authorization": "Phân quyền truy cập",
    "Function Management": "Quản lý chức năng",
  },
};

export const languageOptions = {
  en: "English",
  /* cspell:disable-next-line */
  vi: "Tiếng Việt",
};
