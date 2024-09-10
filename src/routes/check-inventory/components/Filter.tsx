import CateringSelector from "@/components/c-catering/CateringSelector";
import CustomButton from "@/components/c-catering/CustomButton";
import MaterialFilter from "@/components/c-catering/MaterialFilter";
import ResponsiveFilter from "@/components/c-catering/ResponsiveFilter";
import useTranslation from "@/hooks/useTranslation";
import { Department } from "@/services/domain";
import useMetaDataStore from "@/stores/meta-data.store";
import { Flex } from "@mantine/core";
import { useMemo } from "react";
import { CheckType, FilterType } from "../_configs";
import RadioChecked from "./RadioChecked";

type FilterProps = {
  cateringId: string;
  caterings: Department[];
  condition?: FilterType;
  keyword: string;
  names: string[];
  filtered: boolean;
  reset: () => void;
  reload: () => void;
  updateCondition: (
    key: string,
    _default: unknown,
    value: unknown,
    keyword?: string,
  ) => void;
  setCatering: (value?: string) => void;
  setCondition: (
    value: React.SetStateAction<FilterType | undefined>,
  ) => void;
  updated: boolean;
  save: () => void;
};

const Filter = ({
  cateringId,
  caterings,
  condition,
  keyword,
  names,
  filtered,
  reset,
  reload,
  updateCondition,
  setCatering,
  setCondition,
  updated,
  save,
}: FilterProps) => {
  const t = useTranslation();
  const { departmentNameById } = useMetaDataStore();

  const cateringName = useMemo(() => {
    return departmentNameById.get(cateringId || "") || "";
  }, [cateringId, departmentNameById]);

  const filterComponent = (
    <>
      <Flex
        justify="space-between"
        align="end"
        gap={10}
        w="100%"
        direction={{ base: "column", sm: "row" }}
      >
        <CateringSelector
          w={{ base: "100%", sm: "20vw" }}
          cateringName={cateringName}
          caterings={caterings}
          setCatering={setCatering}
        />
        {cateringId && (
          <Flex
            justify="end"
            align="end"
            gap={10}
            w={{ base: "100%", sm: "75%" }}
            direction={{ base: "column", sm: "row" }}
          >
            <MaterialFilter
              type={condition?.type}
              group={condition?.group}
              keyword={keyword}
              materialNames={names}
              clearable={filtered}
              onClear={() => {
                reset();
                setCatering("");
              }}
              onReload={reload}
              onChangeGroup={updateCondition.bind(null, "group", "")}
              onChangeType={(value) => {
                setCondition({
                  type: value,
                  group: "",
                  checkType: condition?.checkType || CheckType.ALL,
                });
              }}
            />
          </Flex>
        )}
        <CustomButton
          visibleFrom="sm"
          confirm
          disabled={!updated}
          onClick={save}
        >
          {t("Save")}
        </CustomButton>
      </Flex>
      {cateringId && (
        <RadioChecked
          condition={condition}
          updateCondition={updateCondition}
        />
      )}
    </>
  );

  return (
    <>
      <Flex direction="column" visibleFrom="sm">
        {filterComponent}
      </Flex>
      <ResponsiveFilter>{filterComponent}</ResponsiveFilter>
    </>
  );
};

export default Filter;
