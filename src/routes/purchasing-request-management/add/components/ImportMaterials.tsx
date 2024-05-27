import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import { Flex } from "@mantine/core";

type ImportMaterialsProps = {
  selectedSource: string | null;
  onChangeSelectedSource: (value: string | null) => void;
};

export enum ImportMaterialAction {
  LOAD_LOW_STOCK = "LOAD_LOW_STOCK",
  LOAD_PERIODIC = "LOAD_PERIODIC",
  LOAD_DAILY_MENU = "LOAD_DAILY_MENU",
  IMPORT_FROM_EXCEL = "IMPORT_FROM_EXCEL",
  ADD_MATERIAL = "ADD_MATERIAL",
}

const ImportMaterials = ({
  selectedSource,
  onChangeSelectedSource,
}: ImportMaterialsProps) => {
  const t = useTranslation();
  const materialOptions = [
    {
      value: ImportMaterialAction.LOAD_LOW_STOCK,
      label: t("Low stock"),
    },
    {
      value: ImportMaterialAction.LOAD_PERIODIC,
      label: t("Recurring list"),
    },
    {
      value: ImportMaterialAction.LOAD_DAILY_MENU,
      label: t("Daily Menu"),
    },
    {
      value: ImportMaterialAction.IMPORT_FROM_EXCEL,
      label: t("Import from excel"),
    },
    {
      value: ImportMaterialAction.ADD_MATERIAL,
      label: t("Add material"),
    },
  ];

  return (
    <Flex justify="start" align="start" gap={10}>
      <Select
        label={t("Material source options")}
        options={materialOptions}
        value={selectedSource}
        onChange={onChangeSelectedSource}
        allowDeselect={false}
        w="24.5%"
        required
      />
    </Flex>
  );
};

export default ImportMaterials;
