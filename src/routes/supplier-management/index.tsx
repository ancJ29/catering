import Autocomplete from "@/components/common/Autocomplete";
import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import { getAllSuppliers, type Supplier } from "@/services/domain";
import { Button, Flex, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useCallback, useMemo, useState } from "react";
import { configs } from "./_configs";
import AddSupplierForm from "./components/AddSupplierForm";
import UpdateSupplierForm from "./components/UpdateSupplierForm";

const reload = () => window.location.reload();

const SupplierManagement = () => {
  const t = useTranslation();
  const dataGridConfigs = useMemo(() => configs(t, reload), [t]);
  const [page, setPage] = useState(1);

  const {
    data,
    names,
    filter: _filter,
    change,
  } = useFilterData<Supplier>({
    reload: getAllSuppliers,
  });

  const filter = useCallback(
    (keyword: string) => {
      setPage(1);
      _filter(keyword);
    },
    [_filter],
  );

  const addSupplier = useCallback(() => {
    modals.open({
      title: t("Add supplier"),
      classNames: { title: "c-catering-font-bold" },
      centered: true,
      size: "lg",
      children: <AddSupplierForm onSuccess={reload} />,
    });
  }, [t]);

  const updateSupplier = useCallback((supplier: Supplier) => {
    modals.open({
      title: supplier.name,
      classNames: { title: "c-catering-font-bold" },
      centered: true,
      size: "lg",
      children: (
        <UpdateSupplierForm supplier={supplier} onSuccess={reload} />
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
        <Button w={100} onClick={addSupplier}>
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
