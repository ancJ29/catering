import MultiSelect from "@/components/common/MultiSelect";
import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import {
  materialOrderCycleOptions,
  typeAndGroupOptions,
} from "@/services/domain";
import useMetaDataStore from "@/stores/meta-data.store";
import { useMemo } from "react";
import AutocompleteForFilterData from "../AutocompleteForFilterData";
import CustomButton from "../CustomButton";

type MaterialFilterProps = {
  type?: string;
  group?: string;
  keyword?: string;
  clearable?: boolean;
  materialNames: string[];
  orderCycles?: string[];
  onClear: () => void;
  onReload: (keyword?: string) => void;
  onChangeGroup: (value: string) => void;
  onChangeType: (value: string) => void;
  onChangeOrderCycles?: (value: string[]) => void;
};

const MaterialFilter = ({
  type,
  group,
  keyword,
  materialNames,
  orderCycles,
  clearable,
  onClear,
  onReload,
  onChangeGroup,
  onChangeType,
  onChangeOrderCycles,
}: MaterialFilterProps) => {
  const t = useTranslation();
  const { materialGroupByType } = useMetaDataStore();
  const [typeOptions, groupOptions] = useMemo(() => {
    return typeAndGroupOptions(materialGroupByType, type || "", t);
  }, [materialGroupByType, t, type]);

  const [orderCycleOptions] = useMemo(() => {
    return materialOrderCycleOptions(t);
  }, [t]);

  return (
    <>
      <Select
        value={type}
        label={t("Material type")}
        w={{ base: "100%", sm: "20vw" }}
        options={typeOptions}
        onChange={(value) => onChangeType(value || "")}
      />
      <Select
        value={group}
        label={t("Material group")}
        w={{ base: "100%", sm: "20vw" }}
        options={groupOptions}
        onChange={(value) => onChangeGroup(value || "")}
      />
      <AutocompleteForFilterData
        label={t("Material name")}
        w={{ base: "100%", sm: "20vw" }}
        data={materialNames}
        value={keyword}
        onReload={onReload}
      />
      {onChangeOrderCycles && (
        <MultiSelect
          value={orderCycles}
          label={t("Material order cycle")}
          w={{ base: "100%", sm: "20vw" }}
          options={orderCycleOptions}
          onChange={onChangeOrderCycles}
        />
      )}
      <CustomButton
        mt={{ base: 10, sm: 0 }}
        disabled={!clearable}
        onClick={onClear}
      >
        {t("Clear")}
      </CustomButton>
    </>
  );
};

export default MaterialFilter;
