import { TablerIconsProps } from "@tabler/icons-react";

export type DashboardDataType = {
  title: string;
  unit?: string;
  amount: number;
  icon: (props: TablerIconsProps) => JSX.Element;
  iconColor: string;
};

export type DailyTaskType = {
  title: string;
  content: string;
  url: string;
};
