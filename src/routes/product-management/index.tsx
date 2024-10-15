import AddButton from "@/components/c-catering/AddButton";
import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import { Product } from "@/services/domain";
import userProductStore from "@/stores/product.store";
import { Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FilterType,
  ProductRequest,
  configs,
  defaultCondition,
  filter,
} from "./_configs";
import AddProductForm from "./components/AddProductForm";
import Filter from "./components/Filter";
import UpdateProductForm from "./components/UpdateProductForm";

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

  const addProduct = useCallback(
    (values?: ProductRequest) => {
      modals.open({
        title: t("Add product"),
        classNames: { title: "c-catering-font-bold" },
        centered: true,
        size: "lg",
        children: (
          <AddProductForm initValues={values} reOpen={addProduct} />
        ),
      });
    },
    [t],
  );

  const updateProduct = useCallback(
    (product: Product) => {
      modals.open({
        title: t("Update product"),
        classNames: { title: "c-catering-font-bold" },
        centered: true,
        size: "lg",
        children: (
          <UpdateProductForm
            product={product}
            reOpen={updateProduct}
          />
        ),
      });
    },
    [t],
  );

  return (
    <Stack gap={10} pos="relative">
      <AddButton onClick={() => addProduct()} label="Add product" />
      <Filter
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
        onRowClick={updateProduct}
      />
    </Stack>
  );
};

export default ProductManagement;
