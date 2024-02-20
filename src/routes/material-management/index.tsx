import Autocomplete from "@/components/common/Autocomplete";
import DataGrid from "@/components/common/DataGrid";
import Select from "@/components/common/Select";
import useFilterData from "@/hooks/useFilterData";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import { Material, typeAndGroupOptions } from "@/services/domain";
import useMaterialStore from "@/stores/material.store";
import useMetaDataStore from "@/stores/meta-data.store";
import { Button, Flex, Stack } from "@mantine/core";
import { useCallback, useMemo, useState } from "react";
import { configs } from "./_configs";

const MaterialManagement = () => {
  const t = useTranslation();
  const { materialGroupByType } = useMetaDataStore();
  const { materials, reload: reloadMaterial } = useMaterialStore();
  const dataGridConfigs = useMemo(() => configs(t), [t]);
  const [type, setType] = useState<string>("");
  const [group, setGroup] = useState<string>("");

  useOnMounted(reloadMaterial);

  const reload = useCallback(() => {
    return Array.from(materials.values());
  }, [materials]);

  const {
    records,
    counter,
    page,
    data: _data,
    filter,
    change,
    setPage,
    clear: _clear,
  } = useFilterData<Material>({
    reload,
  });

  const [typeOptions, groupOptions] = useMemo(() => {
    return typeAndGroupOptions(materialGroupByType, type, t);
  }, [materialGroupByType, t, type]);

  const [data, names] = useMemo(() => {
    setPage(1);
    const data = _data.filter((c) => {
      if (type && c.others.type !== type) {
        return false;
      }
      if (group && c.others.group !== group) {
        return false;
      }
      return true;
    });
    const names = Array.from(records.values())
      .filter((c) => {
        if (type && c.others.type !== type) {
          return false;
        }
        if (group && c.others.group !== group) {
          return false;
        }
        return true;
      })
      .map((c) => c.name);
    return [data, names];
  }, [setPage, _data, records, type, group]);

  const clear = useCallback(() => {
    setType("");
    setGroup("");
    _clear();
  }, [_clear]);

  const onChangeType = useCallback(
    (value: string | null) => {
      if (value && value in materialGroupByType) {
        setType(value);
      } else {
        setType("");
      }
    },
    [materialGroupByType],
  );
  const onChangeGroup = useCallback((value: string | null) => {
    setGroup(value || "");
  }, []);

  return (
    <Stack gap={10}>
      <Flex justify="end" align={"end"} gap={10} key={counter}>
        <Select
          value={type || ""}
          label={t("Material type")}
          w={"20vw"}
          options={typeOptions}
          onChange={onChangeType}
        />
        <Select
          value={group || ""}
          label={t("Material group")}
          w={"20vw"}
          options={groupOptions}
          onChange={onChangeGroup}
        />
        <Autocomplete
          label={t("Material name")}
          w={"20vw"}
          onEnter={filter}
          data={names}
          onChange={change}
        />
        <Button onClick={clear}>{t("Clear")}</Button>
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
