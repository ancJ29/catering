import {
  ClientRoles,
  DailyMenuStatus,
  MaterialGroup,
  MaterialOrderCycle,
  MaterialType,
  PCStatus,
  PIStatus,
  POStatus,
  ProductType,
  PRPriority,
  PRStatus,
  PRType,
} from "../others";
import en from "./en";
import vi from "./vi";

const version = "1.0.1709219376271";

type DepartmentKey = `user.role.${ClientRoles}`;
type ProductKey = `products.type.${ProductType}`;
type DailyMenuKey = `dailyMenu.status.${DailyMenuStatus}`;
type MaterialKey =
  | `materials.type.${MaterialType}`
  | `materials.group.${MaterialGroup}`
  | `materials.orderCycle.${MaterialOrderCycle}`;
type PurchaseRequestKey =
  | `purchaseRequest.type.${PRType}`
  | `purchaseRequest.priority.${PRPriority}`
  | `purchaseRequest.status.${PRStatus}`;
type PurchaseInternalKey = `purchaseInternal.status.${PIStatus}`;
type PurchaseCoordinationKey = `purchaseCoordination.status.${PCStatus}`;
type PurchaseOrderKey = `purchaseOrder.status.${POStatus}`;

const departmentDictionaries: {
  en: Record<DepartmentKey, string>;
  vi: Record<DepartmentKey, string>;
} = {
  en: {
    [`user.role.${ClientRoles.OWNER}`]: "Owner",
    [`user.role.${ClientRoles.MANAGER}`]: "Manager",
    [`user.role.${ClientRoles.PRODUCTION}`]: "Production",
    [`user.role.${ClientRoles.PURCHASING}`]: "Purchasing",
    [`user.role.${ClientRoles.CATERING}`]: "Catering",
    [`user.role.${ClientRoles.ACCOUNTING}`]: "Accounting",
    [`user.role.${ClientRoles.SUPPLIER}`]: "Supplier",
  } as Record<DepartmentKey, string>, // TOD: remove this
  vi: {
    /* cspell:disable */
    [`user.role.${ClientRoles.OWNER}`]: "OWNER",
    [`user.role.${ClientRoles.MANAGER}`]: "Quản lý ",
    [`user.role.${ClientRoles.PRODUCTION}`]: "Sản xuất",
    [`user.role.${ClientRoles.PURCHASING}`]: "Cung ứng",
    [`user.role.${ClientRoles.CATERING}`]: "Bếp",
    [`user.role.${ClientRoles.ACCOUNTING}`]: "kế toán",
    [`user.role.${ClientRoles.SUPPLIER}`]: "Nhà cung cấp",
    /* cspell:enable */
  } as Record<DepartmentKey, string>, // TOD: remove this
};

const dailyMenuDictionaries: {
  en: Record<DailyMenuKey, string>;
  vi: Record<DailyMenuKey, string>;
} = {
  en: {
    "dailyMenu.status.NEW": "New",
    "dailyMenu.status.WAITING": "Waiting",
    "dailyMenu.status.CONFIRMED": "Confirmed",
    "dailyMenu.status.PROCESSING": "Processing",
    "dailyMenu.status.READY": "Ready",
    "dailyMenu.status.DELIVERED": "Delivered",
  },
  vi: {
    /* cspell:disable */
    "dailyMenu.status.NEW": "Chưa xác nhận số lượng",
    "dailyMenu.status.WAITING": "Chờ bếp xác nhận",
    "dailyMenu.status.CONFIRMED": "Đã xác nhận",
    "dailyMenu.status.PROCESSING": "Bếp đang chuẩn bị",
    "dailyMenu.status.READY": "Sẵn sàng giao",
    "dailyMenu.status.DELIVERED": "Đã giao",
    /* cspell:enable */
  },
};

const productDictionaries: {
  en: Record<ProductKey, string>;
  vi: Record<ProductKey, string>;
} = {
  en: {
    "products.type.CP": "Cost",
    "products.type.KV": "Appetizer",
    "products.type.CM": "Soup",
    "products.type.CA": "Vegetarian soup",
    "products.type.CO": "Cơm",
    "products.type.MC": "Main dish",
    "products.type.CT": "Additional food",
    "products.type.CC": "Vegetarian main dish",
    "products.type.NC": "Vegetarian soup",
    "products.type.NM": "Soup",
    "products.type.LU": "Boiled",
    "products.type.TM": "Desert",
    "products.type.XC": "Vegetarian vegetable",
    "products.type.CT1": "Additional food for party",
    "products.type.NM1": "Soup for party",
    "products.type.MC1": "Main dish for party",
  },
  vi: {
    /* cspell:disable */
    "products.type.CP": "CHI PHÍ",
    "products.type.KV": "Món ăn khai vị",
    "products.type.CM": "Canh",
    "products.type.CA": "Canh chay",
    "products.type.CO": "Cơm",
    "products.type.MC": "Mặn chính",
    "products.type.CT": "Món cải thiện",
    "products.type.CC": "Món chay chính",
    "products.type.NC": "Món nước phần ăn chay",
    "products.type.NM": "Món nước phần ăn mặn",
    "products.type.LU": "Rau củ xào, luộc",
    "products.type.TM": "Tráng miệng",
    "products.type.XC": "Xào chay",
    "products.type.CT1": "Tiệc - Món cải thiện",
    "products.type.NM1": "Tiệc - Món nước (phần ăn mặn)",
    "products.type.MC1": "Tiệc - Phần ăn mặn",
    /* cspell:enable */
  },
};
const materialDictionaries: {
  en: Record<MaterialKey, string>;
  vi: Record<MaterialKey, string>;
} = {
  en: {
    "materials.type.BS": "Dessert fruit milk cake",
    /* cspell:disable-next-line */
    "materials.type.BTBDKD": "Maintenance, Servicing, Inspection",
    "materials.type.KH": "Other consumable expenses",
    /* cspell:disable-next-line */
    "materials.type.CCDC": "Tools",
    "materials.type.GB": "Rice vermicelli",
    "materials.type.VG": "Spice",
    /* cspell:disable-next-line */
    "materials.type.NTNV": "Boarding House, Staff",
    "materials.type.GA": "Fuel",
    "materials.type.RCQ": "Vegetable",
    "materials.type.TCT": "Fish meat and eggs",
    "materials.type.TTB": "Equipment",
    "materials.type.VPP": "Stationery",
    "materials.type.YT": "Medical",
    "materials.type.DC": "Vegetarian food",
    "materials.type.DP": "Uniform",
    "materials.group.D": "Milk cake",
    "materials.group.M": "Fruit, dessert tea",
    "materials.group.L": "Maintenance, Servicing, Inspection",
    "materials.group.K": "Other Production Costs",
    "materials.group.X": "Tools",
    "materials.group.O": "Vermicelli, noodles, noodles",
    "materials.group.E": "Sticky rice",
    "materials.group.V": "Spice",
    "materials.group.Ư": "Boarding House, Staff",
    "materials.group.F": "Firewood",
    "materials.group.A": "Gas",
    "materials.group.R": "Vegetables for cooking food",
    "materials.group.C": "Fish of all kinds",
    "materials.group.S": "Other seafood",
    "materials.group.B": "Beef of all kinds",
    "materials.group.G": "Chicken and duck of all kinds",
    "materials.group.H": "Pork of all kinds",
    "materials.group.T": "Eggs of all kinds",
    "materials.group.I": "Equipment",
    "materials.group.N": "Stationery",
    "materials.group.Y": "Health, Food Safety and Hygiene",
    "materials.group.Z": "Vegetarian food",
    "materials.group.P": "Uniform",
    "materials.orderCycle.HN": "Daily",
    "materials.orderCycle.DK": "Periodic",
  },
  vi: {
    /* cspell:disable */
    "materials.type.BS": "Bánh sữa trái cây tráng miệng",
    "materials.type.BTBDKD": "Bảo Trì,Bảo Dưỡng,Kiểm định",
    "materials.type.KH": "Chi phí tiêu hao khác",
    "materials.type.CCDC": "Công Cụ Dụng Cụ",
    "materials.type.GB": "Gạo bún",
    "materials.type.VG": "Gia vị",
    "materials.type.NTNV": "Nhà Trọ,Nhân Viên",
    "materials.type.GA": "Nhiên liệu",
    "materials.type.RCQ": "Rau củ quả",
    "materials.type.TCT": "Thịt cá trứng",
    "materials.type.TTB": "Trang Thiết Bị",
    "materials.type.VPP": "Văn Phòng Phẩm",
    "materials.type.YT": "Y tế",
    "materials.type.DC": "Đồ chay",
    "materials.type.DP": "Đồng Phục",
    "materials.group.D": "Bánh sữa",
    "materials.group.M": "Trái cây, chè tráng miệng",
    "materials.group.L": "Bảo Trì,Bảo Dưỡng,Kiểm định",
    "materials.group.K": "Chi Phí SX Khác",
    "materials.group.X": "Công Cụ Dụng Cụ",
    "materials.group.O": "Bún, mì, hủ tiếu",
    "materials.group.E": "Gạo, nếp",
    "materials.group.V": "Gia vị",
    "materials.group.Ư": "Nhà Trọ,Nhân Viên",
    "materials.group.F": "Củi",
    "materials.group.A": "Gas",
    "materials.group.R": "Rau củ nấu thực phẩm",
    "materials.group.C": "Cá các loại",
    "materials.group.S": "Hải sản khác",
    "materials.group.B": "Thịt bò các loại",
    "materials.group.G": "Thịt gà, vịt các loại",
    "materials.group.H": "Thịt heo các loại",
    "materials.group.T": "Trứng các loại",
    "materials.group.I": "Trang Thiết Bị",
    "materials.group.N": "Văn Phòng Phẩm",
    "materials.group.Y": "Y Tế,ATVSTP",
    "materials.group.Z": "Đồ chay",
    "materials.group.P": "Đồng Phục",
    "materials.orderCycle.HN": "Hằng ngày",
    "materials.orderCycle.DK": "Định kỳ",
    /* cspell:enable */
  },
};

const purchaseRequestDictionaries: {
  en: Record<PurchaseRequestKey, string>;
  vi: Record<PurchaseRequestKey, string>;
} = {
  en: {
    "purchaseRequest.type.HN": "Daily",
    "purchaseRequest.type.DK": "Recurring",
    "purchaseRequest.priority.BT": "Normal",
    "purchaseRequest.priority.KC": "Urgent",
    "purchaseRequest.status.DG": "Sent",
    "purchaseRequest.status.DD": "Approved",
    "purchaseRequest.status.KD": "Not approved",
    "purchaseRequest.status.DDP": "Purchasing order",
    "purchaseRequest.status.MH": "Purchase",
    "purchaseRequest.status.DNH": "Receiving",
    "purchaseRequest.status.NH": "Received",
    "purchaseRequest.status.DH": "Canceled",
  },
  vi: {
    /* cspell:disable */
    "purchaseRequest.type.HN": "Hằng ngày",
    "purchaseRequest.type.DK": "Định kỳ",
    "purchaseRequest.priority.BT": "Bình thường",
    "purchaseRequest.priority.KC": "Khẩn cấp",
    "purchaseRequest.status.DG": "Đã gửi",
    "purchaseRequest.status.DD": "Đã duyệt",
    "purchaseRequest.status.KD": "Không duyệt",
    "purchaseRequest.status.DDP": "Đang điều phối",
    "purchaseRequest.status.MH": "Mua hàng",
    "purchaseRequest.status.DNH": "Đang nhận hàng",
    "purchaseRequest.status.NH": "Đã nhận hàng",
    "purchaseRequest.status.DH": "Đã huỷ",
    /* cspell:enable */
  },
};

const purchaseInternalDictionaries: {
  en: Record<PurchaseInternalKey, string>;
  vi: Record<PurchaseInternalKey, string>;
} = {
  en: {
    "purchaseInternal.status.DG": "Sent",
    "purchaseInternal.status.DD": "Approved",
    "purchaseInternal.status.SSGH": "Ready to deliver",
    "purchaseInternal.status.NK1P": "Partially warehoused",
    "purchaseInternal.status.DNK": "Stocked",
  },
  vi: {
    /* cspell:disable */
    "purchaseInternal.status.DG": "Đã gửi",
    "purchaseInternal.status.DD": "Đã duyệt",
    "purchaseInternal.status.SSGH": "Sẵn sàng giao hàng",
    "purchaseInternal.status.NK1P": "Nhập kho một phần",
    "purchaseInternal.status.DNK": "Đã nhập kho",
    /* cspell:enable */
  },
};

const purchaseCoordinationDictionaries: {
  en: Record<PurchaseCoordinationKey, string>;
  vi: Record<PurchaseCoordinationKey, string>;
} = {
  en: {
    /* cspell:disable */
    "purchaseCoordination.status.CXL": "Pending",
    "purchaseCoordination.status.CNCCPH": "Waiting for supplier response",
    "purchaseCoordination.status.NCCPH": "Supplier responded",
    "purchaseCoordination.status.NCCSSGH": "Supplier ready to deliver",
    "purchaseCoordination.status.NCCDGH": "Supplier delivered",
    /* cspell:enable */
  },
  vi: {
    /* cspell:disable */
    "purchaseCoordination.status.CXL": "Chờ xử lý",
    "purchaseCoordination.status.CNCCPH": "Chờ nhà cung cấp phản hồi",
    "purchaseCoordination.status.NCCPH": "Nhà cung cấp phản hồi",
    "purchaseCoordination.status.NCCSSGH": "Nhà cung cấp sẵn sàng giao hàng",
    "purchaseCoordination.status.NCCDGH": "Nhà cung cấp đã giao hàng",
    /* cspell:enable */
  },
};

const purchaseOrderDictionaries: {
  en: Record<PurchaseOrderKey, string>;
  vi: Record<PurchaseOrderKey, string>;
} = {
  en: {
    /* cspell:disable */
    "purchaseOrder.status.DG": "Sent",
    "purchaseOrder.status.DTC": "The supplier refused",
    "purchaseOrder.status.DD": "Supplier approved",
    "purchaseOrder.status.SSGH": "Ready to deliver",
    "purchaseOrder.status.NK1P": "Warehouse 1 part",
    "purchaseOrder.status.DNK": "Stocked",
    "purchaseOrder.status.DKTSL": "Checked for errors",
    "purchaseOrder.status.DTDNTT": "Payment request created",
    "purchaseOrder.status.DCBSHD": "Updated invoice number",
    "purchaseOrder.status.DLLTT": "Payment scheduled",
    "purchaseOrder.status.TT1P": "Partial payment",
    "purchaseOrder.status.DTT": "Paid",
    /* cspell:enable */
  },
  vi: {
    /* cspell:disable */
    "purchaseOrder.status.DG": "Đã gửi",
    "purchaseOrder.status.DTC": "NCC đã từ chối",
    "purchaseOrder.status.DD": "NCC đã duyệt",
    "purchaseOrder.status.SSGH": "Sẵn sàng giao hàng",
    "purchaseOrder.status.NK1P": "Nhập kho 1 phần",
    "purchaseOrder.status.DNK": "Đã nhập kho",
    "purchaseOrder.status.DKTSL": "Đã kiểm tra sai lệch",
    "purchaseOrder.status.DTDNTT": "Đã tạo đề nghị thanh toán",
    "purchaseOrder.status.DCBSHD": "Đã cập nhật số hoá đơn",
    "purchaseOrder.status.DLLTT": "Đã lập lịch thanh toán",
    "purchaseOrder.status.TT1P": "Thanh toán 1 phần",
    "purchaseOrder.status.DTT": "Đã thanh toán",
    /* cspell:enable */
  },
};

export const dictionaries: {
  version: string;
  en: Record<string, string>;
  vi: Record<string, string>;
} = {
  version,
  en: {
    ...departmentDictionaries.en,
    ...dailyMenuDictionaries.en,
    ...materialDictionaries.en,
    ...productDictionaries.en,
    ...purchaseRequestDictionaries.en,
    ...purchaseInternalDictionaries.en,
    ...purchaseCoordinationDictionaries.en,
    ...purchaseOrderDictionaries.en,
    ...en,
  },
  vi: {
    ...departmentDictionaries.vi,
    ...dailyMenuDictionaries.vi,
    ...materialDictionaries.vi,
    ...productDictionaries.vi,
    ...purchaseRequestDictionaries.vi,
    ...purchaseInternalDictionaries.vi,
    ...purchaseCoordinationDictionaries.vi,
    ...purchaseOrderDictionaries.vi,
    ...vi,
  },
};
