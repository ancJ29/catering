import { OptionProps } from "@/types";
import {
  CheckIcon,
  Combobox,
  Group,
  Input,
  Pill,
  PillsInput,
  Text,
  useCombobox,
} from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import classes from "./MultiSelect.module.scss";

type MultiSelectProps = {
  label?: string;
  options: OptionProps[];
  value?: string[];
  placeholder?: string;
  onChange: (value: string[]) => void;
  w?: string;
};

const MultiSelect = ({
  label,
  options,
  value = [],
  placeholder,
  onChange,
  w,
}: MultiSelectProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth);
    }
  }, []);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () =>
      combobox.updateSelectedOptionIndex("active"),
  });

  const handleValueSelect = (val: string) => {
    onChange(
      value.includes(val)
        ? value.filter((v) => v !== val)
        : [...value, val],
    );
  };

  const handleValueRemove = (val: string) => {
    onChange(value.filter((v) => v !== val));
  };

  const PillItems = () => {
    let valueWidth = 0;
    let lastIndex = value.length;
    for (let i = 0; i < value.length; i++) {
      valueWidth += (value[i].length * 20) + 70;
      if (valueWidth > width) {
        break;
      }
      lastIndex = i + 1;
    }
    return (
      <>
        {value.slice(0, lastIndex).map((item) => (
          <Pill
            key={item}
            withRemoveButton
            onRemove={() => handleValueRemove(item)}
          >
            {options.find((e) => e.value === item)?.label}
          </Pill>
        ))}
        {lastIndex < value.length && <Text>...</Text>}
      </>
    );
  };

  const comboboxOptions = options.map((item) => {
    const itemId = item.value.toString();
    return (
      <Combobox.Option
        key={itemId}
        value={itemId}
        active={value.includes(itemId)}
      >
        <Group gap="sm">
          {value.includes(itemId) ? <CheckIcon size={12} /> : null}
          <span>{item.label}</span>
        </Group>
      </Combobox.Option>
    );
  });

  return (
    <div style={{ width: w }} ref={ref}>
      {label && <Text className={classes.label}>{label}</Text>}

      <Combobox
        store={combobox}
        onOptionSubmit={handleValueSelect}
        withinPortal={false}
      >
        <Combobox.DropdownTarget>
          <PillsInput
            pointer
            rightSection={<IconChevronDown size={16} />}
            onClick={() => combobox.toggleDropdown()}
          >
            <Pill.Group className={classes.pillGroup}>
              {value.length > 0 ? (
                <PillItems />
              ) : (
                <Input.Placeholder>{placeholder}</Input.Placeholder>
              )}

              <Combobox.EventsTarget>
                <PillsInput.Field
                  type="hidden"
                  onBlur={() => combobox.closeDropdown()}
                  onKeyDown={(event) => {
                    if (event.key === "Backspace") {
                      event.preventDefault();
                      handleValueRemove(value[value.length - 1]);
                    }
                  }}
                />
              </Combobox.EventsTarget>
            </Pill.Group>
          </PillsInput>
        </Combobox.DropdownTarget>

        <Combobox.Dropdown>
          <Combobox.Options>{comboboxOptions}</Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </div>
  );
};

export default MultiSelect;
