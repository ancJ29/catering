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
    roles: ["client-owner", "client-sales"],
    dashboard: ["client-sales"],
    key: "menu-management",
    label: "Menu Management",
    icon: "chef-hat",
    url: "/menu-management",
  },
] satisfies Menu;