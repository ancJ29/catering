import { wrTypeSchema } from "@/auto-generated/api-configs";
import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import {
  getAllWarehouseExports,
  WarehouseReceipt,
} from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import { endOfDay, startOfDay } from "@/utils";
import { Stack } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  caseSchema,
  configs,
  defaultCondition,
  filter,
  FilterType,
} from "./_configs";
import Filter from "./components/Filter";

const ExportManagement = () => {
  const t = useTranslation();
  const [currents, setCurrents] = useState<WarehouseReceipt[]>([]);
  const { caterings } = useCateringStore();

  const dataGridConfigs = useMemo(
    () => configs(t, caterings),
    [t, caterings],
  );

  const getData = async (from?: number, to?: number) => {
    setCurrents(await getAllWarehouseExports(from, to));
  };

  useEffect(() => {
    getData();
  }, []);

  const dataLoader = useCallback(() => {
    return currents;
  }, [currents]);

  const {
    condition,
    data,
    page,
    setPage,
    updateCondition,
    filtered,
    reset,
  } = useFilterData<WarehouseReceipt, FilterType>({
    dataLoader: dataLoader,
    filter,
    defaultCondition,
  });

  const onChangeDateRange = (from?: number, to?: number) => {
    if (condition?.from && condition?.to && from && to) {
      const _from = startOfDay(from);
      const _to = endOfDay(to);
      if (from < condition.from || to > condition.to) {
        getData(_from, _to);
      }
      updateCondition("from", "", _from);
      updateCondition("to", "", to);
    }
  };

  const handleChangeCase = (value: string) => {
    updateCondition("case", "", value);
    if (value === caseSchema.Values["Warehouse transfer"]) {
      updateCondition("type", "", wrTypeSchema.Values.XCK);
    }
  };

  const handleChangeType = (value: string) => {
    updateCondition("type", "", value);
    if (value === caseSchema.Values["Warehouse transfer"]) {
      updateCondition("case", "", wrTypeSchema.Values.XCK);
    } else {
      updateCondition(
        "case",
        "",
        caseSchema.Values["Released from warehouse"],
      );
    }
  };

  return (
    <Stack gap={10} key={caterings.size}>
      <Filter
        from={condition?.from}
        to={condition?.to}
        type={condition?.type}
        case={condition?.case}
        clearable={filtered}
        onClear={reset}
        onChangeType={handleChangeType}
        onChangeCase={handleChangeCase}
        onChangeDateRange={onChangeDateRange}
      />
      <DataGrid
        page={page}
        limit={10}
        isPaginated
        hasOrderColumn
        columns={dataGridConfigs}
        data={data}
        onChangePage={setPage}
      />
    </Stack>
  );
};

export default ExportManagement;
