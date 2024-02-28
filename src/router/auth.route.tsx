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
  CateringManagement: lazy(() => import("@/routes/catering-management")),
  ProductManagement: lazy(() => import("@/routes/product-management")),
  MaterialManagement: lazy(() => import("@/routes/material-management")),
  MaterialSupplierManagement: lazy(() => import("@/routes/material-management/supplier")),
  UnitManagement: lazy(() => import("@/routes/unit-management")),
  SupplierManagement: lazy(() => import("@/routes/supplier-management")),
  SupplierMaterialManagement: lazy(() => import("@/routes/supplier-management/material")),
  SupplierCateringManagement: lazy(() => import("@/routes/supplier-management/catering")),
  MenuManagement: lazy(() => import("@/routes/menu-management")),
  MenuManagementDetail: lazy(() => import("@/routes/menu-management/detail")),
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
    path: "/menu-management/:customerId/:targetName/:shift/:timestamp",
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
