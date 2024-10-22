import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import { Material } from "@/services/domain";
import useAuthStore from "@/stores/auth.store";
import useMaterialStore from "@/stores/material.store";
import useSupplierStore from "@/stores/supplier.store";
import { Stack } from "@mantine/core";
import { useCallback, useMemo } from "react";
import {
  filter as _filter,
  configs,
  defaultCondition,
  FilterType,
} from "./_configs";
import Filter from "./components/Filter";

const QuotationManagement = () => {
  const t = useTranslation();
  const { materials } = useMaterialStore();
  const { cateringId } = useAuthStore();
  const { suppliers } = useSupplierStore();

  const dataGridConfigs = useMemo(
    () => configs(t, cateringId, suppliers),
    [cateringId, suppliers, t],
  );

  const dataLoader = useCallback(() => {
    return Array.from(materials.values());
  }, [materials]);

  const filter = useCallback(
    (el: Material, filter?: FilterType | undefined) => {
      return _filter(el, filter, cateringId);
    },
    [cateringId],
  );

  const {
    condition,
    data,
    keyword,
    names,
    page,
    reload,
    setPage,
    updateCondition,
    setCondition,
    filtered,
    reset,
  } = useFilterData<Material, FilterType>({
    dataLoader: dataLoader,
    filter,
    defaultCondition,
  });

  return (
    <Stack gap={10}>
      <Filter
        condition={condition}
        keyword={keyword}
        names={names}
        filtered={filtered}
        reset={reset}
        reload={reload}
        updateCondition={updateCondition}
        setCondition={setCondition}
      />
      <DataGrid
        key={suppliers.size}
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

export default QuotationManagement;
