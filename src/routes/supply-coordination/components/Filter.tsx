import PurchaseRequestFilter from "@/components/c-catering/PurchaseRequestFilter";
import ResponsiveFilter from "@/components/c-catering/ResponsiveFilter";
import { FilterType } from "@/configs/filters/purchase-request";
import useTranslation from "@/hooks/useTranslation";
import { typePriorityAndStatusRequestOptions } from "@/services/domain";
import { Flex } from "@mantine/core";
import { useMemo } from "react";

type FilterProps = {
  condition?: FilterType;
  keyword: string;
  names: string[];
  filtered: boolean;
  reset: () => void;
  reload: () => void;
  updateCondition: (
    key: string,
    _default: unknown,
    value: unknown,
    keyword?: string,
  ) => void;
  onChangeDateRange: (from?: number, to?: number) => void;
};

const Filter = ({
  condition,
  keyword,
  names,
  filtered,
  reset,
  reload,
  updateCondition,
  onChangeDateRange,
}: FilterProps) => {
  const t = useTranslation();
  const [typeOptions, priorityOptions, statusOptions] =
    useMemo(() => {
      return typePriorityAndStatusRequestOptions(t);
    }, [t]);

  const filterComponent = (
    <PurchaseRequestFilter
      keyword={keyword}
      from={condition?.from}
      to={condition?.to}
      types={condition?.types}
      priorities={condition?.priorities}
      statuses={condition?.statuses}
      departmentIds={condition?.departmentIds}
      purchaseOrderIds={names}
      typeOptions={typeOptions}
      priorityOptions={priorityOptions}
      statusOptions={statusOptions}
      clearable={filtered}
      onClear={reset}
      onReload={reload}
      onChangeTypes={updateCondition.bind(null, "types", "")}
      onChangePriorities={updateCondition.bind(
        null,
        "priorities",
        "",
      )}
      onChangeStatuses={updateCondition.bind(null, "statuses", "")}
      onChangeDepartmentIds={updateCondition.bind(
        null,
        "departmentIds",
        "",
      )}
      onChangeDateRange={onChangeDateRange}
      showStatusSelect={false}
    />
  );

  return (
    <>
      <Flex direction="column" visibleFrom="sm">
        {filterComponent}
      </Flex>
      <ResponsiveFilter>{filterComponent}</ResponsiveFilter>
    </>
  );
};

export default Filter;
