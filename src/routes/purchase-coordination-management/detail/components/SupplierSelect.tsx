import useTranslation from "@/hooks/useTranslation";
import {
  CheckIcon,
  Combobox,
  Group,
  InputBase,
  useCombobox,
} from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { SupplierSelectItemData } from "../_config";
import SupplierSelectItem from "./SupplierSelectItem";

type SupplierSelectProps = {
  value?: string | null;
  onChangeValue: (value: string) => void;
  data: SupplierSelectItemData[];
  disabled?: boolean;
};

const SupplierSelect = ({
  value,
  onChangeValue,
  data,
  disabled,
}: SupplierSelectProps) => {
  const t = useTranslation();
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const selectedOption = data.find(
    (item) => item.supplierId === value,
  );

  const options = data.map((item) => (
    <Combobox.Option
      value={item.supplierId}
      key={item.supplierId}
      active={item.supplierId === value}
    >
      <Group gap="xs">
        {item.supplierId === value && <CheckIcon size={12} />}
        <SupplierSelectItem {...item} />
      </Group>
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(value) => {
        onChangeValue(value);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={<IconChevronDown size={16} />}
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
          multiline
          disabled={disabled}
        >
          {selectedOption ? (
            <SupplierSelectItem {...selectedOption} />
          ) : (
            <></>
          )}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options mah={200} style={{ overflowY: "auto" }}>
          {options.length === 0 ? (
            <Combobox.Empty>{t("Nothing found")}</Combobox.Empty>
          ) : (
            options
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};

export default SupplierSelect;
