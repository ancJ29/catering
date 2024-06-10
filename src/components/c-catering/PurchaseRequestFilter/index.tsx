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
import { useMemo } from "react";
import AutocompleteForFilterData from "../AutocompleteForFilterData";
import CustomButton from "../CustomButton";
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
  clearable?: boolean;
  onClear: () => void;
  onReload: (keyword?: string) => void;
  onChangeTypes: (value: string[]) => void;
  onChangePriorities: (value: string[]) => void;
  onChangeStatuses: (value: string[]) => void;
  onChangeDepartmentIds: (value: string[]) => void;
  onChangeDateRange: (from?: number, to?: number) => void;
  showStatusSelect?: boolean;
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
  clearable,
  onClear,
  onReload,
  onChangeTypes,
  onChangePriorities,
  onChangeStatuses,
  onChangeDepartmentIds,
  onChangeDateRange,
  showStatusSelect = true,
}: PurchaseOrderFilterProps) => {
  const t = useTranslation();
  const { caterings } = useCateringStore();
  const [typeOptions, priorityOptions, statusOptions] =
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
      <div className={classes.rangeDateContainer}>
        <DateRangeInput
          label={t("Purchase order date")}
          from={from}
          to={to}
          onChange={onChangeDateRange}
          w={"22vw"}
        />
        <CustomButton disabled={!clearable} onClick={onClear}>
          {t("Clear")}
        </CustomButton>
      </div>
      <div className={classes.filterContainer}>
        <AutocompleteForFilterData
          label={t("Purchase order id")}
          w={"20vw"}
          data={purchaseOrderIds}
          defaultValue={keyword}
          onReload={onReload}
          disabled={false}
        />
        <MultiSelect
          value={types}
          label={t("Purchase order type")}
          w={"20vw"}
          options={typeOptions}
          onChange={onChangeTypes}
        />
        <MultiSelect
          value={priorities}
          label={t("Purchase order priority")}
          w={"20vw"}
          options={priorityOptions}
          onChange={onChangePriorities}
        />
        {showStatusSelect && (
          <MultiSelect
            value={statuses}
            label={t("Status")}
            w={"20vw"}
            options={statusOptions}
            onChange={onChangeStatuses}
          />
        )}
        <MultiSelect
          value={departmentIds}
          label={t("Purchase order kitchen")}
          w={"20vw"}
          options={_caterings}
          onChange={onChangeDepartmentIds}
        />
      </div>
    </div>
  );
};

export default PurchaseRequestFilter;
