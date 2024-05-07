import DateRangeInput from "@/components/common/DateRangeInput";
import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import { Department, getFilterData } from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import { ONE_DAY } from "@/utils";
import { Button } from "@mantine/core";
import { useMemo } from "react";
import AutocompleteForFilterData from "../AutocompleteForFilterData";
import classes from "./PurchaseOrderFilter.module.scss";

type PurchaseOrderFilterProps = {
  keyword?: string;
  from?: number;
  to?: number;
  type?: string;
  priority?: string;
  status?: string;
  departmentName?: string;
  purchaseOrderIds: string[];
  onReload: (keyword?: string) => void;
  onChangeType: (value: string) => void;
  onChangePriority: (value: string) => void;
  onChangeStatus: (value: string) => void;
  onChangeDepartmentName: (value: string) => void;
  onChangeDateRange: (from?: number, to?: number) => void;
  onFilter: () => void;
};

const PurchaseOrderFilter = ({
  keyword,
  from = Date.now() - ONE_DAY,
  to = Date.now() + ONE_DAY,
  type,
  priority,
  status,
  departmentName,
  purchaseOrderIds,
  onReload,
  onChangeType,
  onChangePriority,
  onChangeStatus,
  onChangeDepartmentName,
  onChangeDateRange,
  onFilter,
}: PurchaseOrderFilterProps) => {
  const t = useTranslation();
  const { caterings } = useCateringStore();
  const [typeOptions, statusOptions, priorityOptions] =
    useMemo(() => {
      return getFilterData(t);
    }, [t]);

  const _caterings: string[] = useMemo(() => {
    return Array.from(caterings.values()).map(
      (p: Department) => p.name,
    );
  }, [caterings]);

  return (
    <div className={classes.container}>
      <div className={classes.detail}>
        <DateRangeInput
          label={t("Purchase order date")}
          from={from}
          to={to}
          onChange={onChangeDateRange}
          w={"20%"}
        />
        <Button onClick={onFilter}>{t("Filter")}</Button>
        <Button onClick={() => null}>{t("Add")}</Button>
      </div>
      <div className={classes.detail}>
        <AutocompleteForFilterData
          label={t("Purchase order id")}
          w={"20%"}
          data={purchaseOrderIds}
          defaultValue={keyword}
          onReload={onReload}
        />
        <Select
          value={type || ""}
          label={t("Purchase order type")}
          w={"20%"}
          options={typeOptions}
          onChange={(value) => onChangeType(value || "")}
        />
        <Select
          value={priority || ""}
          label={t("Purchase order priority")}
          w={"20%"}
          options={priorityOptions}
          onChange={(value) => onChangePriority(value || "")}
        />
        <Select
          value={status || ""}
          label={t("Status")}
          w={"20%"}
          options={statusOptions}
          onChange={(value) => onChangeStatus(value || "")}
        />
        <AutocompleteForFilterData
          label={t("Purchase order kitchen")}
          w={"20%"}
          data={_caterings}
          defaultValue={departmentName}
          onReload={(value) => onChangeDepartmentName(value || "")}
        />
      </div>
    </div>
  );
};

export default PurchaseOrderFilter;
