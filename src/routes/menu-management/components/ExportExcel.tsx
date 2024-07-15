import useTranslation from "@/hooks/useTranslation";
import { Button, Combobox, Group, useCombobox } from "@mantine/core";
import { useState } from "react";

const data = [
  "Export menu (excel file)",
  "Export production orders (excel file)",
];

export type ExportExcelProps = {
  onExportMenu: () => void;
  onExportProductionOrders: () => void;
};

const ExportExcel = ({
  onExportMenu,
  onExportProductionOrders,
}: ExportExcelProps) => {
  const t = useTranslation();
  const [selectedItem, setSelectedItem] = useState<string | null>(
    null,
  );
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const handleChangeSelectedItem = (val: string) => {
    setSelectedItem(val);
    val === data[0] ? onExportMenu() : onExportProductionOrders();
  };

  const options = data.map((item) => (
    <Combobox.Option
      value={item}
      key={item}
      active={item === selectedItem}
    >
      <Group gap="xs" justify="space-between">
        {t(item)}
      </Group>
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      width={300}
      position="bottom-start"
      withinPortal={false}
      onOptionSubmit={(val) => {
        handleChangeSelectedItem(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <Button onClick={() => combobox.toggleDropdown()}>
          {t("Functions")}
        </Button>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};

export default ExportExcel;
