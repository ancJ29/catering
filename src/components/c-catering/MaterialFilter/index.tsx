import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import { typeAndGroupOptions } from "@/services/domain";
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
  onClear: () => void;
  onReload: (keyword?: string) => void;
  onChangeGroup: (value: string) => void;
  onChangeType: (value: string) => void;
};

const MaterialFilter = ({
  type,
  group,
  keyword,
  materialNames,
  clearable,
  onClear,
  onReload,
  onChangeGroup,
  onChangeType,
}: MaterialFilterProps) => {
  const t = useTranslation();
  const { materialGroupByType } = useMetaDataStore();
  const [typeOptions, groupOptions] = useMemo(() => {
    return typeAndGroupOptions(materialGroupByType, type || "", t);
  }, [materialGroupByType, t, type]);

  return (
    <>
      <Select
        value={type || ""}
        label={t("Material type")}
        w={"20vw"}
        options={typeOptions}
        onChange={(value) => onChangeType(value || "")}
      />
      <Select
        value={group || ""}
        label={t("Material group")}
        w={"20vw"}
        options={groupOptions}
        onChange={(value) => onChangeGroup(value || "")}
      />
      <AutocompleteForFilterData
        label={t("Material name")}
        w={"20vw"}
        data={materialNames}
        defaultValue={keyword}
        onReload={onReload}
      />
      <CustomButton disabled={!clearable} onClick={onClear}>
        {t("Clear")}
      </CustomButton>
    </>
  );
};

export default MaterialFilter;
