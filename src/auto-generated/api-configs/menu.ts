import { Menu } from "@/types";

export default [
  {
    roles: ["client-owner", "client-sales"],
    key: "metadata",
    label: "Metadata Management",
    icon: "clipboard-list",
    subs: [
      {
        roles: ["client-owner"],
        key: "unit",
        label: "Unit Management",
        icon: "atom",
        url: "/unit-management",
      },
      {
        roles: ["client-owner", "client-sales"],
        key: "customer",
        label: "Customer Management",
        icon: "building-bank",
        url: "/customer-management",
        dashboard: ["client-owner"],
      },
      {
        roles: ["client-owner"],
        key: "supplier",
        label: "Supplier Management",
        icon: "truck",
        url: "/supplier-management",
      },
      {
        roles: ["client-owner"],
        key: "catering",
        label: "Catering Management",
        icon: "cooker",
        url: "/catering-management",
      },
      {
        roles: ["client-owner"],
        key: "product",
        label: "Product Management",
        icon: "soup",
        url: "/product-management",
      },
      {
        roles: ["client-owner"],
        key: "material",
        label: "Material Management",
        icon: "cheese",
        url: "/material-management",
      },
      {
        roles: ["client-owner"],
        key: "user",
        label: "User Management",
        icon: "user-square",
        url: "/user-management",
      },
    ],
  },
  {
    roles: ["client-owner"],
    key: "purchasing-order-management",
    label: "Purchasing Order Management",
    icon: "package-import",
    subs: [
      {
        roles: ["client-owner"],
        key: "purchasing-request-management",
        label: "Purchasing Request Management",
        icon: "message-question",
      },
      {
        roles: ["client-owner"],
        key: "purchasing-order-management",
        label: "Purchasing Order Management",
        icon: "package-import",
      },
      {
        roles: ["client-owner"],
        key: "internal-purchasing-order-management",
        label: "Internal Purchasing Order Management",
        icon: "package",
      },
    ],
  },
  {
    roles: ["client-owner"],
    key: "quotation-management",
    label: "Quotation Management",
    icon: "blockquote",
    subs: [
      {
        roles: ["client-owner"],
        key: "quotation-management",
        label: "Quotation Management",
        icon: "blockquote",
      },
      {
        roles: ["client-owner"],
        key: "quotation-history-management",
        label: "Quotation History Management",
        icon: "history",
      },
    ],
  },
  {
    roles: [
      "client-owner",
      "client-sales",
      "client-catering",
      "client-purchasing",
    ],
    dashboard: ["client-sales", "client-catering", "client-purchasing"],
    key: "menu-management",
    label: "Menu Management",
    icon: "chef-hat",
    url: "/menu-management",
  },
  {
    roles: ["client-owner", "client-sales"],
    key: "payment-management",
    label: "Payment Management",
    icon: "credit-card",
    subs: [
      {
        roles: ["client-owner", "client-sales"],
        key: "payment-adjustment",
        label: "Payment Adjustment",
        icon: "edit-circle",
      },
      {
        roles: ["client-owner", "client-sales"],
        key: "payment-schedule",
        label: "Payment Schedule",
        icon: "credit-card-pay",
      },
    ],
  },
  {
    roles: ["client-owner"],
    key: "report-management",
    label: "Report Management",
    icon: "report",
    subs: [
      {
        roles: ["client-owner"],
        key: "quick-report",
        label: "Quick Report",
        icon: "checkup-list",
      },
      {
        roles: ["client-owner"],
        key: "report-template",
        label: "Report Templates",
        icon: "template",
      },
    ],
  },
] satisfies Menu;
