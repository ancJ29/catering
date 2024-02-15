export enum ActionGroups {
  METADATA = "Metadata",
  AUTHENTICATIONS = "Authentications",
  DEPARTMENT_MANAGEMENT = "Department management",
  CUSTOMER_MANAGEMENT = "Customer management",
  MESSAGE_MANAGEMENT = "Message management",
  USER_MANAGEMENT = "User management",
  PROFILE_MANAGEMENT = "Profile management",
  PRODUCT_MANAGEMENT = "Product management",
  MENU_MANAGEMENT = "Menu management",
  MATERIAL_MANAGEMENT = "Material management",
  SUPPLIER_MANAGEMENT = "Supplier management",
}

export enum Actions {
  LOGIN = "login",
  GET_METADATA = "get-metadata",
  GET_MESSAGES = "get-messages",
  GET_ALL_MESSAGE_TEMPLATES = "get-all-message-templates",
  ADD_MESSAGE_TEMPLATE = "add-message-template",
  DISABLE_MESSAGE_TEMPLATE = "disable-message-template",
  ENABLE_MESSAGE_TEMPLATE = "enable-message-template",
  GET_USERS = "get-users",
  CHANGE_PASSWORD = "change-password",
  DISABLE_USERS = "disable-users",
  ADD_USER = "add-user",
  UPDATE_USER = "update-user",
  GET_DEPARTMENTS = "get-departments",
  ADD_DEPARTMENT = "add-department",
  UPDATE_DEPARTMENT = "update-department",
  DELETE_DEPARTMENT = "delete-department",
  GET_CUSTOMERS = "get-customers",
  GET_PRODUCTS = "get-products",
  ADD_PRODUCT = "add-product",
  // UPDATE_PRODUCT = "update-product",
  // DELETE_PRODUCT = "delete-product",
  // GET_MENUS = "get-menus",
  ADD_MENU = "add-menu",
  GET_DAILY_MENU = "get-daily-menu",
  PUSH_DAILY_MENU = "push-daily-menu",
  // UPDATE_MENU = "update-menu",
  // DELETE_MENU = "delete-menu",
  GET_MATERIALS = "get-materials",
  GET_SUPPLIERS = "get-suppliers",
  ADD_SUPPLIER = "add-supplier",
  UPDATE_SUPPLIER = "update-supplier",
  UPDATE_SUPPLIER_MATERIAL = "update-supplier-material",
}

export enum Permissions {
  SYSTEM_ADMIN_PERMISSION = "system-admin",
  PROFILE_MANAGEMENT = "profile-management",
  USER_MANAGEMENT = "user-management",
  MESSAGE_FULL_ACCESS = "message-full-access",
  DEPARTMENT_FULL_ACCESS = "department-full-access",
  CUSTOMER_FULL_ACCESS = "customer-full-access",
  DEPARTMENT_OPERATION = "department-operation",
  DEPARTMENT_READ_ONLY = "department-read-only",
  PRODUCT_FULL_ACCESS = "product-full-access",
  MENU_FULL_ACCESS = "menu-full-access",
  MATERIAL_FULL_ACCESS = "material-full-access",
  SUPPLIER_FULL_ACCESS = "supplier-full-access",
}

export enum Policy {}
// TODO: add policies

export enum RequestDecorator {}
// TODO: add request decorators
