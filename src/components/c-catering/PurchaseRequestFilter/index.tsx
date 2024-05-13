import DateRangeInput from "@/components/common/DateRangeInput";
import MultiSelect from "@/components/common/MultiSelect";
import useTranslation from "@/hooks/useTranslation";
import {
  Department,
  typeStatusAndPriorityOptions,
} from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import { OptionProps } from "@/types";
import { ONE_DAY } from "@/utils";
import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useMemo } from "react";
import AutocompleteForFilterData from "../AutocompleteForFilterData";
import classes from "./PurchaseRequestFilter.module.scss";

type PurchaseOrderFilterProps = {
  keyword?: string;
  from?: number;
  to?: number;
  types?: string[];
  priorities?: string[];
  statuses?: string[];
  departmentIds?: string[];
  purchaseOrderIds: string[];
  onReload: (keyword?: string) => void;
  onChangeTypes: (value: string[]) => void;
  onChangePriorities: (value: string[]) => void;
  onChangeStatuses: (value: string[]) => void;
  onChangeDepartmentIds: (value: string[]) => void;
  onChangeDateRange: (from?: number, to?: number) => void;
};

const PurchaseRequestFilter = ({
  keyword,
  from = Date.now() - ONE_DAY,
  to = Date.now() + ONE_DAY,
  types,
  priorities,
  statuses,
  departmentIds,
  purchaseOrderIds,
  onReload,
  onChangeTypes,
  onChangePriorities,
  onChangeStatuses,
  onChangeDepartmentIds,
  onChangeDateRange,
}: PurchaseOrderFilterProps) => {
  const t = useTranslation();
  const { caterings } = useCateringStore();
  const [typeOptions, statusOptions, priorityOptions] =
    useMemo(() => {
      return typeStatusAndPriorityOptions(t);
    }, [t]);

  const _caterings: OptionProps[] = useMemo(() => {
    return Array.from(caterings.values()).map((p: Department) => ({
      label: p.name,
      value: p.id,
    }));
  }, [caterings]);

  return (
    <div className={classes.container}>
      <div className={classes.buttonContainer}>
        <Button
          onClick={() => null}
          leftSection={<IconPlus size={16} />}
        >
          {t("Add purchase request")}
        </Button>
      </div>
      <div className={classes.rangeDateContainer}>
        <DateRangeInput
          label={t("Purchase order date")}
          from={from}
          to={to}
          onChange={onChangeDateRange}
          w={"22vw"}
        />
      </div>
      <div className={classes.filterContainer}>
        <AutocompleteForFilterData
          label={t("Purchase order id")}
          w={"20vw"}
          data={purchaseOrderIds}
          defaultValue={keyword}
          onReload={onReload}
        />
        <MultiSelect
          value={types}
          label={t("Purchase order type")}
          w={"20vw"}
          options={typeOptions}
          onChange={onChangeTypes}
          searchable
        />
        <MultiSelect
          value={priorities}
          label={t("Purchase order priority")}
          w={"20vw"}
          options={priorityOptions}
          onChange={onChangePriorities}
          searchable
        />
        <MultiSelect
          value={statuses}
          label={t("Status")}
          w={"20vw"}
          options={statusOptions}
          onChange={onChangeStatuses}
          searchable
        />
        <MultiSelect
          value={departmentIds}
          label={t("Purchase order kitchen")}
          w={"20vw"}
          options={_caterings}
          onChange={onChangeDepartmentIds}
          searchable
        />
      </div>
    </div>
  );
};

export default PurchaseRequestFilter;
