import { TablerIconsProps } from "@tabler/icons-react";

export type DashboardDataType = {
  title: string;
  unit?: string;
  amount?: number;
  icon?: (props: TablerIconsProps) => JSX.Element;
  iconColor?: string;
  url?: string;
  description?: string;
  cateringIds?: string[];
};
