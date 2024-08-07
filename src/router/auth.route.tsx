import { lazy } from "react";
import { Navigate } from "react-router-dom";

type GenericProps = Record<string, unknown>;
type RFC = (props?: GenericProps) => React.JSX.Element;
type NoPropsRFC = () => React.JSX.Element;
type Wrapper = React.LazyExoticComponent<RFC>;
type LazyExoticComponent = React.LazyExoticComponent<NoPropsRFC>;
type Config = {
  path: string;
  element: string | (() => JSX.Element);
  wrapper?: {
    element: Wrapper;
    props?: GenericProps;
  };
};

// prettier-ignore
const ServiceWrapper = lazy(() => import("@/layouts/Admin/ServiceWrapper"));
// prettier-ignore
const componentMap: Record<string, LazyExoticComponent> = {
  Dashboard: lazy(() => import("@/routes/dashboard")),
  Profile: lazy(() => import("@/routes/profile")),
  UserManagement: lazy(() => import("@/routes/user-management")),
  CustomerManagement: lazy(() => import("@/routes/customer-management")),
  CustomerProductManagement: lazy(() => import("@/routes/customer-management/product")),
  CustomerTargetManagement: lazy(() => import("@/routes/customer-management/target")),
  CateringManagement: lazy(() => import("@/routes/catering-management")),
  CateringSupplierManagement: lazy(() => import("@/routes/catering-management/supplier")),
  ProductManagement: lazy(() => import("@/routes/product-management")),
  MaterialManagement: lazy(() => import("@/routes/material-management")),
  MaterialSupplierManagement: lazy(() => import("@/routes/material-management/supplier")),
  UnitManagement: lazy(() => import("@/routes/unit-management")),
  SupplierManagement: lazy(() => import("@/routes/supplier-management")),
  SupplierMaterialManagement: lazy(() => import("@/routes/supplier-management/material")),
  SupplierCateringManagement: lazy(() => import("@/routes/supplier-management/catering")),
  MenuManagement: lazy(() => import("@/routes/menu-management")),
  InventoryManagement: lazy(() => import("@/routes/inventory-management")),
  CheckInventory: lazy(() => import("@/routes/check-inventory")),
  MenuManagementDetail: lazy(() => import("@/routes/menu-management/detail")),
  BomManagement: lazy(() => import("@/routes/bom-management")),
  PurchaseRequestManagement: lazy(() => import("@/routes/purchase-request-management")),
  PurchaseRequestDetail: lazy(() => import("@/routes/purchase-request-management/detail")),
  AddPurchaseRequest: lazy(() => import("@/routes/purchase-request-management/add")),
  PurchaseOrderManagement: lazy(() => import("@/routes/purchase-order-management")),
  PurchaseOrderDetail: lazy(() => import("@/routes/purchase-order-management/detail")),
  PurchaseCoordinationManagement: lazy(() => import("@/routes/purchase-coordination-management")),
  PurchaseCoordinationDetail: lazy(() => import("@/routes/purchase-coordination-management/detail")),
  PurchaseInternalManagement: lazy(() => import("@/routes/purchase-internal-management")),
  PurchaseInternalDetail: lazy(() => import("@/routes/purchase-internal-management/detail")),
  SupplyCoordination: lazy(() => import("@/routes/supply-coordination")),
  SupplyCoordinationDetail: lazy(() => import("@/routes/supply-coordination/detail")),
  MealManagement: lazy(() => import("@/routes/meal-management")),
  DeviationAdjustmentManagement: lazy(() => import("@/routes/deviation-adjustment-management")),
  DeviationAdjustmentDetail: lazy(() => import("@/routes/deviation-adjustment-management/detail")),
  InventoryTransactionDetails: lazy(() => import("@/routes/inventory-transaction-details")),
  WarehouseManagement: lazy(() => import("@/routes/warehouse-management")),
  WarehouseDetailManagement: lazy(() => import("@/routes/warehouse-management/detail")),
  ExternalWareHouseEntry: lazy(() => import("@/routes/external-warehouse-entry")),
  ExternalWarehouseImportDetail: lazy(() => import("@/routes/external-warehouse-entry/detail")),
  InternalWareHouseEntry: lazy(() => import("@/routes/internal-warehouse-entry")),
  InternalWarehouseImportDetail: lazy(() => import("@/routes/internal-warehouse-entry/detail")),
  ExportManagement: lazy(() => import("@/routes/export-management")),
  BlankPage: lazy(() => import("@/routes/blank-page")),
};

const configs: Config[] = [
  {
    path: "/dashboard",
    element: "Dashboard",
    wrapper: {
      element: ServiceWrapper as Wrapper,
    },
  },
  {
    path: "/user-management",
    element: "UserManagement",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "User Management",
      },
    },
  },
  {
    path: "/Menu-management",
    element: "MenuManagement",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "Menu Management",
      },
    },
  },
  {
    path: "/menu-management/:customerName/:targetName/:shift/:timestamp",
    element: "MenuManagementDetail",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "Menu Management",
      },
    },
  },
  {
    path: "/unit-management",
    element: "UnitManagement",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "Unit Management",
      },
    },
  },
  {
    path: "/bom-management",
    element: "BomManagement",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "BOM Management",
      },
    },
  },
  {
    path: "/customer-management",
    element: "CustomerManagement",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "Customer Management",
      },
    },
  },
  {
    path: "/customer-management/product/:customerId",
    element: "CustomerProductManagement",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "Customer Management",
      },
    },
  },
  {
    path: "/customer-management/target/:customerId",
    element: "CustomerTargetManagement",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "Customer Management",
      },
    },
  },
  {
    path: "/catering-management",
    element: "CateringManagement",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "Catering Management",
      },
    },
  },
  {
    path: "/catering-management/supplier/:cateringId",
    element: "CateringSupplierManagement",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "Catering Management",
      },
    },
  },
  {
    path: "/product-management",
    element: "ProductManagement",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "Product Management",
      },
    },
  },
  {
    path: "/material-management",
    element: "MaterialManagement",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "Material Management",
      },
    },
  },
  {
    path: "/material-management/supplier/:materialId",
    element: "MaterialSupplierManagement",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "Material Management",
      },
    },
  },
  {
    path: "/supplier-management",
    element: "SupplierManagement",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "Supplier Management",
      },
    },
  },
  {
    path: "/supplier-management/material/:supplierId",
    element: "SupplierMaterialManagement",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "Supplier Management",
      },
    },
  },
  {
    path: "/supplier-management/catering/:supplierId",
    element: "SupplierCateringManagement",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "Supplier Management",
      },
    },
  },
  {
    path: "/profile",
    element: "Profile",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "Profile",
      },
    },
  },
  {
    path: "/*",
    element: () => <Navigate to="/dashboard" />,
  },
  {
    path: "/inventory-management",
    element: "InventoryManagement",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "Inventory List",
      },
    },
  },
  {
    path: "/check-inventory",
    element: "CheckInventory",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "Check Inventory",
      },
    },
  },
  {
    path: "/purchase-request-management",
    element: "PurchaseRequestManagement",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "Purchase Request Management",
      },
    },
  },
  {
    path: "/purchase-request-management/:purchaseRequestId",
    element: "PurchaseRequestDetail",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "Purchase Request Detail",
      },
    },
  },
  {
    path: "/purchase-request-management/add",
    element: "AddPurchaseRequest",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "Add Purchase Request",
      },
    },
  },
  {
    path: "/supply-coordination",
    element: "SupplyCoordination",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "Supply Coordination",
      },
    },
  },
  {
    path: "/supply-coordination/:purchaseRequestId",
    element: "SupplyCoordinationDetail",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "Purchase Request Detail",
      },
    },
  },
  {
    path: "/purchase-order-management",
    element: "PurchaseOrderManagement",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "Purchase Order Management",
      },
    },
  },
  {
    path: "/purchase-order-management/:purchaseOrderId",
    element: "PurchaseOrderDetail",
  },
  {
    path: "/purchase-internal-management",
    element: "PurchaseInternalManagement",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "Purchase Internal Management",
      },
    },
  },
  {
    path: "/purchase-internal-management/:purchaseInternalId",
    element: "PurchaseInternalDetail",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "Purchase Internal Detail",
      },
    },
  },
  {
    path: "/purchase-coordination-management",
    element: "PurchaseCoordinationManagement",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "Purchase Coordination Management",
      },
    },
  },
  {
    path: "/purchase-coordination-management/:purchaseCoordinationId",
    element: "PurchaseCoordinationDetail",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "Purchase Coordination Detail",
      },
    },
  },
  {
    path: "/meal-management",
    element: "MealManagement",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "Meal Management",
      },
    },
  },
  {
    path: "/deviation-adjustment-management",
    element: "DeviationAdjustmentManagement",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "Deviation Adjustment Management",
      },
    },
  },
  {
    path: "/deviation-adjustment-management/:purchaseOrderId",
    element: "DeviationAdjustmentDetail",
  },
  {
    path: "/inventory-transaction-details",
    element: "InventoryTransactionDetails",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "Inventory Transaction Details",
      },
    },
  },
  {
    path: "/warehouse-management",
    element: "WarehouseManagement",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "Warehouse Management",
      },
    },
  },
  {
    path: "/warehouse-management/:warehouseId",
    element: "WarehouseDetailManagement",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "Warehouse Receipt Detail",
      },
    },
  },
  {
    path: "/external-warehouse-entry",
    element: "ExternalWareHouseEntry",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "External Warehouse Entry",
      },
    },
  },
  {
    path: "/external-warehouse-entry/:purchaseOrderId",
    element: "ExternalWarehouseImportDetail",
  },
  {
    path: "/internal-warehouse-entry",
    element: "InternalWareHouseEntry",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "Internal Warehouse Entry",
      },
    },
  },
  {
    path: "/internal-warehouse-entry/:purchaseInternalId",
    element: "InternalWarehouseImportDetail",
  },
  {
    path: "/export-management",
    element: "ExportManagement",
    wrapper: {
      element: ServiceWrapper as Wrapper,
      props: {
        title: "Export List",
      },
    },
  },
];

export default configs.map(_buildRouteConfig);

function _buildRouteConfig(config: Config) {
  const Component =
    typeof config.element === "string"
      ? componentMap[config.element]
      : config.element;
  return {
    path: config.path,
    element: config.wrapper ? (
      <config.wrapper.element {...config.wrapper.props}>
        <Component />
      </config.wrapper.element>
    ) : (
      <Component />
    ),
  };
}
