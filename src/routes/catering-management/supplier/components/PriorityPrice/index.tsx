import AutocompleteForFilterData from "@/components/c-catering/AutocompleteForFilterData";
import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import { Material } from "@/services/domain";
import useMaterialStore from "@/stores/material.store";
import useSupplierStore from "@/stores/supplier.store";
import { Flex, Stack } from "@mantine/core";
import { useCallback, useMemo } from "react";
import { configs } from "./_configs";

type PriorityPriceProps = {
  cateringId?: string;
};

const PriorityPrice = ({ cateringId }: PriorityPriceProps) => {
  const { materials } = useMaterialStore();
  const { suppliers } = useSupplierStore();
  const t = useTranslation();

  const dataGridConfigs = useMemo(
    () => configs(t, suppliers, cateringId),
    [t, suppliers, cateringId],
  );

  const dataLoader = useCallback(() => {
    return Array.from(materials.values());
  }, [materials]);

  const { data, names, page, reload, setPage } =
    useFilterData<Material>({
      dataLoader,
    });

  return (
    <Stack gap={10}>
      <Flex justify="end" align="end" gap={10}>
        <AutocompleteForFilterData
          data={names}
          label={t("Material name")}
          onReload={reload}
          w={{ base: "50%", sm: "20rem" }}
        />
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

export default PriorityPrice;
