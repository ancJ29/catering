import AddButton from "@/components/c-catering/AddButton";
import AutocompleteForFilterData from "@/components/c-catering/AutocompleteForFilterData";
import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import { Supplier } from "@/services/domain";
import useSupplierStore from "@/stores/supplier.store";
import { Flex, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useCallback, useMemo } from "react";
import { configs, SupplierRequest } from "./_configs";
import AddSupplierForm from "./components/AddSupplierForm";
import UpdateSupplierForm from "./components/UpdateSupplierForm";

// TODO: refactor this component (ref: src/routes/menu-management/)
const SupplierManagement = () => {
  const t = useTranslation();
  const dataGridConfigs = useMemo(() => configs(t), [t]);
  const { data, names, page, reload, setPage } =
    useFilterData<Supplier>({ dataLoader });

  const addSupplier = useCallback(
    (values?: SupplierRequest) => {
      modals.open({
        title: t("Add supplier"),
        classNames: { title: "c-catering-font-bold" },
        centered: true,
        size: "lg",
        children: (
          <AddSupplierForm
            initialValues={values}
            reOpen={addSupplier}
          />
        ),
      });
    },
    [t],
  );

  const updateSupplier = useCallback((supplier: Supplier) => {
    modals.open({
      title: supplier.name,
      classNames: { title: "c-catering-font-bold" },
      centered: true,
      size: "lg",
      children: (
        <UpdateSupplierForm
          supplier={supplier}
          reOpen={updateSupplier}
        />
      ),
    });
  }, []);

  return (
    <Stack gap={10} pos="relative">
      <AddButton onClick={() => addSupplier()} label="Add supplier" />
      <Flex justify="end" align="center" gap={10}>
        <AutocompleteForFilterData
          w={{ base: "50%", sm: "20rem" }}
          data={names}
          onReload={reload}
        />
      </Flex>
      <DataGrid
        onRowClick={updateSupplier}
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

export default SupplierManagement;

async function dataLoader(): Promise<Supplier[]> {
  const suppliers = useSupplierStore.getState().suppliers;
  if (suppliers.size) {
    return Array.from(suppliers.values());
  }
  await new Promise((resolve) => setTimeout(resolve, 300));
  return dataLoader();
}
