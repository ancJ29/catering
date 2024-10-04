import AutocompleteForFilterData from "@/components/c-catering/AutocompleteForFilterData";
import CustomButton from "@/components/c-catering/CustomButton";
import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import { Supplier, updateSupplier } from "@/services/domain";
import useSupplierStore from "@/stores/supplier.store";
import { findSuppliersByCateringId } from "@/utils";
import { Flex, Stack } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { configs } from "./_configs";

type CateringSupplierProps = {
  cateringId?: string;
};

const CateringSupplier = ({ cateringId }: CateringSupplierProps) => {
  const t = useTranslation();
  const { suppliers: supplierById, reload: reloadSuppliers } =
    useSupplierStore();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [actives] = useState<Map<string, boolean>>(new Map());
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    if (!cateringId) {
      return;
    }
    const suppliers = findSuppliersByCateringId(cateringId);
    setSuppliers(
      suppliers.flatMap((id) => supplierById.get(id) || []),
    );
  }, [cateringId, supplierById]);

  const setActive = useCallback(
    async (key: string, active: boolean) => {
      actives.set(key, active);
      setChanged(true);
    },
    [actives],
  );

  const dataGridConfigs = useMemo(
    () => configs(t, actives, setActive),
    [t, actives, setActive],
  );

  const dataLoader = useCallback(() => {
    return suppliers;
  }, [suppliers]);

  const { data, names, page, reload, setPage } =
    useFilterData<Supplier>({
      dataLoader,
    });

  const save = useCallback(async () => {
    suppliers.forEach(async (supplier) => {
      await updateSupplier({
        ...supplier,
        others: {
          ...supplier.others,
          active: actives.get(supplier.id) ?? supplier.others.active,
        },
      });
    });
    reloadSuppliers(true);
  }, [actives, reloadSuppliers, suppliers]);

  return (
    <Stack gap={10}>
      <Flex justify="end" align="end" gap={10}>
        <AutocompleteForFilterData
          data={names}
          label={t("Supplier name")}
          onReload={reload}
          w={{ base: "50%", sm: "20rem" }}
        />
        <CustomButton disabled={!changed} onClick={save} confirm>
          {t("Save")}
        </CustomButton>
      </Flex>
      <DataGrid
        hasUpdateColumn={false}
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

export default CateringSupplier;
