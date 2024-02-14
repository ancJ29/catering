import { MantineStyleProp } from "@mantine/core";
import { ReactNode } from "react";

type TextAlign = "left" | "center" | "right";

export type DataGridProps<T> = {
  limit?: number;
  page?: number;
  isPaginated?: boolean;
  className?: string;
  columns: DataGridColumnProps[];
  data?: T[];
  onChangePage?: (page: number) => void;
  onSort?: (column: DataGridColumnProps) => void;
  onRowClick?: (item: T) => void;
  hasUpdateColumn?: boolean;
  hasOrderColumn?: boolean;
  hasActionColumn?: boolean;
  actionHandlers?: DataGridActionProps<T>;
  ActionComponent?: () => ReactNode;
};

export type DataGridColumnProps = {
  key: string;
  header?: string;
  sortable?: boolean;
  sorting?: false | "asc" | "desc";
  width?: number | string;
  textAlign?: TextAlign | { header?: TextAlign; cell?: TextAlign };
  cellStyle?: MantineStyleProp;
  headerStyle?: MantineStyleProp;
  style?: MantineStyleProp;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderCell?: (
    /* eslint-disable @typescript-eslint/no-explicit-any */
    value: any,
    record: any,
    /* eslint-enable @typescript-eslint/no-explicit-any */
  ) => string | number | React.ReactNode;
  hidden?: boolean;
};

export type DataGridActionProps<T> = {
  deletable?: (item?: T) => boolean;
  editable?: (item?: T) => boolean;
  cloneable?: (item?: T) => boolean;
  onDelete?: (item?: T) => void;
  onEdit?: (item?: T) => void;
  onClone?: (item?: T) => void;
};
