import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import {
  getAllWarehouseReceipts,
  typeWarehouseOptions,
  WarehouseReceipt,
} from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import { endOfDay, startOfDay } from "@/utils";
import { Stack } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  configs,
  defaultCondition,
  filter,
  FilterType,
} from "./_configs";
import Filter from "./components/Filter";

const WarehouseManagement = () => {
  const t = useTranslation();
  const navigate = useNavigate();
  const [currents, setCurrents] = useState<WarehouseReceipt[]>([]);
  const { caterings } = useCateringStore();

  const [typeOptions] = useMemo(() => {
    return typeWarehouseOptions(t);
  }, [t]);

  const dataGridConfigs = useMemo(
    () => configs(t, caterings),
    [t, caterings],
  );

  const getData = async (from?: number, to?: number) => {
    setCurrents(await getAllWarehouseReceipts({ from, to }));
  };

  useEffect(() => {
    getData();
  }, []);

  const dataLoader = useCallback(() => {
    return currents;
  }, [currents]);

  const {
    condition,
    counter,
    data,
    keyword,
    names,
    page,
    reload,
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

  const onRowClick = (item: WarehouseReceipt) => {
    navigate(`/warehouse-management/${item.id}`);
  };

  return (
    <Stack gap={10} key={caterings.size}>
      <Filter
        key={counter}
        keyword={keyword}
        from={condition?.from}
        to={condition?.to}
        types={condition?.types}
        cateringIds={condition?.cateringIds}
        warehouseReceiptCodes={names}
        typeOptions={typeOptions}
        clearable={filtered}
        onClear={reset}
        onReload={reload}
        onChangeTypes={updateCondition.bind(null, "types", "")}
        onChangeCateringIds={updateCondition.bind(
          null,
          "cateringIds",
          "",
        )}
        onChangeDateRange={onChangeDateRange}
      />
      <DataGrid
        onRowClick={onRowClick}
        page={page}
        limit={10}
        isPaginated
        hasOrderColumn
        columns={dataGridConfigs}
        data={data}
        onChangePage={setPage}
        hasUpdateColumn={false}
      />
    </Stack>
  );
};

export default WarehouseManagement;
