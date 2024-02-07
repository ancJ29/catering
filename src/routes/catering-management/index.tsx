import { Actions } from "@/auto-generated/api-configs";
import Autocomplete from "@/components/common/Autocomplete";
import DataGrid from "@/components/common/DataGrid";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import { loadAll } from "@/services/data-loaders";
import useMetaDataStore from "@/stores/meta-data.store";
import { Flex, Stack } from "@mantine/core";
import { useCallback, useMemo, useState } from "react";
import { Department, configs } from "./_configs";

const CateringManagement = () => {
  const t = useTranslation();
  const { kitchenType } = useMetaDataStore();
  const dataGridConfigs = useMemo(() => configs(t), [t]);
  const [caterings, setCaterings] = useState<Department[]>([]);
  const [data, setData] = useState<Department[]>([]);
  const [names, setNames] = useState([""]);

  const _reload = useCallback(() => {
    if (!kitchenType) {
      return;
    }
    loadAll<Department>({
      key: "departments",
      action: Actions.GET_DEPARTMENTS,
      params: { type: kitchenType },
    }).then((caterings) => {
      setCaterings(caterings || []);
      setData(caterings || []);
      setNames(caterings.map((c) => c.name as string));
    });
  }, [kitchenType]);

  const filter = useCallback(
    (keyword: string) => {
      if (!keyword) {
        setData(caterings);
        return;
      }
      const _keyword = keyword.toLowerCase();
      setData(
        caterings.filter((c) =>
          (c.name as string)?.toLocaleLowerCase().includes(_keyword),
        ),
      );
    },
    [caterings],
  );

  useOnMounted(_reload);

  return (
    <Stack gap={10} w="100%" h="100%" p={10}>
      <Flex justify="end" align={"center"}>
        <Autocomplete onEnter={filter} data={names} />
      </Flex>
      <DataGrid
        hasOrderColumn
        columns={dataGridConfigs}
        data={data}
      />
    </Stack>
  );
};

export default CateringManagement;
