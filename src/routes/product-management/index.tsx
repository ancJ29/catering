import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import { Product } from "@/services/domain";
import userProductStore from "@/stores/product.store";
import { Stack } from "@mantine/core";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FilterType,
  configs,
  defaultCondition,
  filter,
} from "./_configs";
import Filter from "./components/Filter";

const ProductManagement = () => {
  const t = useTranslation();
  const navigate = useNavigate();
  const dataGridConfigs = useMemo(
    () => configs(t, navigate),
    [t, navigate],
  );
  const { products } = userProductStore();

  const dataLoader = useCallback(() => {
    return Array.from(products.values());
  }, [products]);

  const {
    condition,
    counter,
    data,
    filtered,
    keyword,
    names,
    page,
    reload,
    reset,
    setPage,
    updateCondition,
  } = useFilterData<Product, FilterType>({
    dataLoader,
    filter,
    defaultCondition,
  });

  return (
    <Stack gap={10}>
      <Filter
        counter={counter}
        condition={condition}
        keyword={keyword}
        names={names}
        filtered={filtered}
        reset={reset}
        reload={reload}
        updateCondition={updateCondition}
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

export default ProductManagement;
