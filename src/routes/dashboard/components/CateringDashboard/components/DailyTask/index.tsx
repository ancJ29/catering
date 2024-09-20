import useTranslation from "@/hooks/useTranslation";
import { DailyTaskType } from "@/routes/dashboard/_configs";
import { FilterType as ExternalWarehouseFilterType } from "@/routes/external-warehouse-entry/_configs";
import { FilterType as InternalWarehouseFilterType } from "@/routes/internal-warehouse-entry/_configs";
import { CateringDashboard } from "@/services/domain";
import { buildHash, endOfDay, startOfDay } from "@/utils";
import { Card, Flex } from "@mantine/core";
import { IconBookmark } from "@tabler/icons-react";
import Title from "../../../Title";
import DailyTaskItem from "../DailyTaskItem";
import classes from "./DailyTask.module.scss";

type DailyTaskProps = {
  dashboard?: CateringDashboard;
};

const DailyTask = ({ dashboard }: DailyTaskProps) => {
  const t = useTranslation();

  const internalWarehouseCondition: InternalWarehouseFilterType = {
    id: "",
    from: startOfDay(Date.now()),
    to: endOfDay(Date.now()),
    statuses: [],
    deliveryCateringIds: [],
  };
  const internalWarehouseHash = buildHash(internalWarehouseCondition);

  const externalWarehouseCondition: ExternalWarehouseFilterType = {
    id: "",
    from: startOfDay(Date.now()),
    to: endOfDay(Date.now()),
    statuses: [],
    supplierIds: [],
  };
  const externalWarehouseHash = buildHash(externalWarehouseCondition);

  const data: DailyTaskType[] = [
    {
      title: "Supplier orders",
      content: `${t("Today, there are")} ${
        dashboard?.externalWarehouseEntry || 0
      } ${t("PO order(s) to import")}`,
      url: `/external-warehouse-entry#${externalWarehouseHash}`,
    },
    {
      title: "Internal orders to complete",
      content: `${t("Today, there are")} ${
        dashboard?.internalWarehouseEntry || 0
      } ${t("transfer order(s) to import")}`,
      url: `/internal-warehouse-entry#${internalWarehouseHash}`,
    },
    {
      title: "Warehouse usage output",
      content: `${t("Today, there are")} ${
        dashboard?.warehouseUsageOrder || 0
      } ${t("warehouse usage orders to import")}`,
      url: "/export-inventory",
    },
    {
      title: "Check Inventory",
      content: `${t("Today, there are")} ${
        dashboard?.inventoryCheckInOrder || 0
      } ${t("inventory check order(s) to import")}, ${
        dashboard?.inventoryCheckOutOrder || 0
      } ${t("inventory check order(s) to export")}`,
      url: "/check-inventory",
    },
    {
      // TODO
      title: "Order production materials",
      content: "",
      url: "/purchase-request-management",
    },
    {
      title: "Update meal plans",
      content: t("Update meal plan description"),
      url: "/meal-management",
    },
  ];

  return (
    <Card withBorder radius="md" className={classes.card}>
      <Title icon={IconBookmark} title="Daily task" />
      <Flex mt="md" direction="column" gap={10}>
        {data.map((item, index) => (
          <DailyTaskItem key={index} index={index} item={item} />
        ))}
      </Flex>
    </Card>
  );
};

export default DailyTask;
