import Select from "@/components/common/Select";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import { Material, typeAndGroupOptions } from "@/services/domain";
import useMaterialStore from "@/stores/material.store";
import useMetaDataStore from "@/stores/meta-data.store";
import { unique } from "@/utils";
import { Box, Flex, ScrollArea } from "@mantine/core";
import React, { useCallback, useMemo, useState } from "react";
import AutocompleteForFilterData from "../AutocompleteForFilterData";
import CustomButton from "../CustomButton";
import Selector from "../Selector";

type FilterType = {
  type: string;
  group: string;
};

const defaultCondition: FilterType = {
  type: "",
  group: "",
};

const MaterialSelector = ({
  onAdd,
  onRemove,
  labelGenerator,
  disabled,
  materialIds: _materialIds = [],
}: {
  disabled?: boolean;
  materialIds?: string[];
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  labelGenerator?: (m: Material) => React.ReactNode;
}) => {
  const [materialIds, setMaterialIds] = useState(_materialIds);
  const t = useTranslation();
  const {
    condition,
    counter,
    data,
    filtered,
    keyword,
    names,
    reload,
    reset,
    setCondition,
    updateCondition,
  } = useFilterData<Material, FilterType>({
    dataLoader: materialLoader,
    filter,
    defaultCondition,
  });
  const { materialGroupByType } = useMetaDataStore();

  const [typeOptions, groupOptions] = useMemo(() => {
    return typeAndGroupOptions(
      materialGroupByType,
      condition?.type || "",
      t,
    );
  }, [materialGroupByType, t, condition]);

  const _onAdd = useCallback(
    (id: string) => {
      onAdd(id);
      setMaterialIds((ids) => {
        return unique([...ids, id]);
      });
    },
    [onAdd],
  );

  const _onRemove = useCallback(
    (id: string) => {
      onRemove(id);
      setMaterialIds((ids) => {
        return ids.filter((i) => i !== id);
      });
    },
    [onRemove],
  );

  return (
    <>
      <Flex justify="end" align={"center"} mb="1rem">
        <Select
          key={condition?.type || ""}
          value={condition?.type || ""}
          label={t("Material type")}
          w={"20vw"}
          options={typeOptions}
          onChange={(value) =>
            value !== condition?.type &&
            setCondition({
              type: value || "",
              group: "",
            })
          }
          mb={10}
        />
      </Flex>
      <Flex justify="end" align={"center"} mb="1rem">
        <Select
          key={condition?.group || ""}
          label={t("Material group")}
          value={condition?.group}
          w={"20vw"}
          options={groupOptions}
          onChange={updateCondition.bind(null, "group", "")}
        />
      </Flex>
      <Flex justify="end" align={"center"} mb="1rem">
        <AutocompleteForFilterData
          key={counter}
          defaultValue={keyword}
          label={t("Material name")}
          w={"20vw"}
          data={names}
          onReload={reload}
        />
      </Flex>
      <Box ta="right" mb={10}>
        <CustomButton loading disabled={!filtered} onClick={reset}>
          {t("Clear")}
        </CustomButton>
      </Box>
      <ScrollArea h="60vh">
        <Selector
          disabled={disabled}
          data={data.slice(0, 10)}
          selectedIds={materialIds}
          onAdd={_onAdd}
          onRemove={_onRemove}
          labelGenerator={labelGenerator}
        />
      </ScrollArea>
    </>
  );
};

export default MaterialSelector;

async function materialLoader(): Promise<Material[]> {
  useMaterialStore.getState().reload();
  const materials = useMaterialStore.getState().materials;
  if (materials.size) {
    return Array.from(useMaterialStore.getState().materials.values());
  }
  await new Promise((resolve) => setTimeout(resolve, 300));
  return materialLoader();
}

function filter(m: Material, condition?: FilterType) {
  if (condition?.group && m.others.group !== condition.group) {
    return false;
  }
  if (condition?.type && m.others.type !== condition.type) {
    return false;
  }
  return true;
}
