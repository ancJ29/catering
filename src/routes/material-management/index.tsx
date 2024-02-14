import Autocomplete from "@/components/common/Autocomplete";
import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import { Material, getAllMaterials } from "@/services/domain";
import { Flex, Stack } from "@mantine/core";
import { useCallback, useMemo, useState } from "react";
import { configs } from "./_configs";

const MaterialManagement = () => {
  const t = useTranslation();
  const dataGridConfigs = useMemo(() => configs(t), [t]);
  const [page, setPage] = useState(1);

  const {
    data,
    names,
    filter: _filter,
    change,
  } = useFilterData<Material>({
    reload: getAllMaterials,
  });

  const filter = useCallback(
    (keyword: string) => {
      setPage(1);
      _filter(keyword);
    },
    [_filter],
  );

  return (
    <Stack gap={10}>
      <Flex justify="end" align={"center"}>
        <Autocomplete
          w={"20vw"}
          onEnter={filter}
          data={names}
          onChange={change}
        />
      </Flex>
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

export default MaterialManagement;
