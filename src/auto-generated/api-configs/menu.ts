import { Menu } from "@/types";
import { ClientRoles } from "./others";

export default [
  {
    roles: [ClientRoles.OWNER, ClientRoles.PRODUCTION],
    key: "metadata",
    label: "Metadata Management",
    icon: "clipboard-list",
    subs: [
      {
        roles: [ClientRoles.OWNER],
        key: "unit",
        label: "Unit Management",
        icon: "atom",
        url: "/unit-management",
      },
      {
        roles: [ClientRoles.OWNER, ClientRoles.PRODUCTION],
        key: "customer",
        label: "Customer Management",
        icon: "building-bank",
        url: "/customer-management",
        dashboard: [ClientRoles.OWNER],
      },
      {
        roles: [ClientRoles.OWNER],
        key: "supplier",
        label: "Supplier Management",
        icon: "truck",
        url: "/supplier-management",
      },
      {
        roles: [ClientRoles.OWNER],
        key: "catering",
        label: "Catering Management",
        icon: "cooker",
        url: "/catering-management",
      },
      {
        roles: [ClientRoles.OWNER],
        key: "product",
        label: "Product Management",
        icon: "soup",
        url: "/product-management",
      },
      {
        roles: [ClientRoles.OWNER],
        key: "material",
        label: "Material Management",
        icon: "cheese",
        url: "/material-management",
      },
      {
        roles: [ClientRoles.OWNER],
        key: "user",
        label: "User Management",
        icon: "user-square",
        url: "/user-management",
      },
    ],
  },
  {
    roles: [ClientRoles.OWNER],
    key: "purchasing-order-management",
    label: "Purchasing Order Management",
    icon: "package-import",
    subs: [
      {
        roles: [ClientRoles.OWNER],
        key: "purchasing-request-management",
        label: "Purchasing Request Management",
        icon: "message-question",
      },
      {
        roles: [ClientRoles.OWNER],
        key: "purchasing-order-management",
        label: "Purchasing Order Management",
        icon: "package-import",
      },
      {
        roles: [ClientRoles.OWNER],
        key: "internal-purchasing-order-management",
        label: "Internal Purchasing Order Management",
        icon: "package",
      },
    ],
  },
  {
    roles: [ClientRoles.OWNER],
    key: "quotation-management",
    label: "Quotation Management",
    icon: "blockquote",
    subs: [
      {
        roles: [ClientRoles.OWNER],
        key: "quotation-management",
        label: "Quotation Management",
        icon: "blockquote",
      },
      {
        roles: [ClientRoles.OWNER],
        key: "quotation-history-management",
        label: "Quotation History Management",
        icon: "history",
      },
    ],
  },
  {
    roles: [
      ClientRoles.OWNER,
      ClientRoles.PRODUCTION,
      ClientRoles.CATERING,
      ClientRoles.PURCHASING,
    ],
    dashboard: [
      ClientRoles.PRODUCTION,
      ClientRoles.CATERING,
      ClientRoles.PURCHASING,
    ],
    key: "menu-management",
    label: "Menu Management",
    icon: "chef-hat",
    url: "/menu-management",
  },
  {
    roles: [ClientRoles.OWNER, ClientRoles.PRODUCTION],
    key: "payment-management",
    label: "Payment Management",
    icon: "credit-card",
    subs: [
      {
        roles: [ClientRoles.OWNER, ClientRoles.PRODUCTION],
        key: "payment-adjustment",
        label: "Payment Adjustment",
        icon: "edit-circle",
      },
      {
        roles: [ClientRoles.OWNER, ClientRoles.PRODUCTION],
        key: "payment-schedule",
        label: "Payment Schedule",
        icon: "credit-card-pay",
      },
    ],
  },
  {
    roles: [ClientRoles.OWNER],
    key: "report-management",
    label: "Report Management",
    icon: "report",
    subs: [
      {
        roles: [ClientRoles.OWNER],
        key: "quick-report",
        label: "Quick Report",
        icon: "checkup-list",
      },
      {
        roles: [ClientRoles.OWNER],
        key: "report-template",
        label: "Report Templates",
        icon: "template",
      },
    ],
  },
] satisfies Menu;
