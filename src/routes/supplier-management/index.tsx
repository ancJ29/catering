import Autocomplete from "@/components/common/Autocomplete";
import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import { Supplier } from "@/services/domain";
import useSupplierStore from "@/stores/supplier.store";
import { GenericObject } from "@/types";
import { Button, Flex, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useCallback, useMemo } from "react";
import { configs } from "./_configs";
import AddSupplierForm from "./components/AddSupplierForm";
import UpdateSupplierForm from "./components/UpdateSupplierForm";

const SupplierManagement = () => {
  const t = useTranslation();
  const { suppliers, reload: reloadSuppliers } = useSupplierStore();
  const dataGridConfigs = useMemo(() => configs(t), [t]);

  const dataLoader = useCallback(async () => {
    await reloadSuppliers();
    return Array.from(suppliers.values());
  }, [suppliers, reloadSuppliers]);

  const { data, names, page, onKeywordChanged, reload, setPage } =
    useFilterData<Supplier>({ dataLoader });

  const addSupplier = useCallback(
    (values?: GenericObject) => {
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
    <Stack gap={10}>
      <Flex justify="end" align={"center"} gap={10}>
        <Autocomplete
          w={"20vw"}
          onEnter={reload}
          data={names}
          onChange={onKeywordChanged}
        />
        <Button w={100} onClick={() => addSupplier()}>
          {t("Add")}
        </Button>
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
