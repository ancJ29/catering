import Autocomplete from "@/components/common/Autocomplete";
import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import { Supplier } from "@/services/domain";
import useSupplierStore from "@/stores/supplier.store";
import { GenericObject } from "@/types";
import { Button, Flex, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { configs } from "./_configs";
import AddSupplierForm from "./components/AddSupplierForm";
import UpdateSupplierForm from "./components/UpdateSupplierForm";

const SupplierManagement = () => {
  const t = useTranslation();
  const navigate = useNavigate();
  const supplierStore = useSupplierStore();
  const [page, setPage] = useState(1);
  const dataGridConfigs = useMemo(
    () => configs(t, navigate),
    [t, navigate],
  );

  const reload = useCallback(async () => {
    await supplierStore.reload();
    return Array.from(supplierStore.suppliers.values());
  }, [supplierStore]);

  const {
    data,
    names,
    filter: _filter,
    change,
  } = useFilterData<Supplier>({
    reload,
  });

  const filter = useCallback(
    (keyword: string) => {
      setPage(1);
      _filter(keyword);
    },
    [_filter],
  );

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
          onEnter={filter}
          data={names}
          onChange={change}
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
