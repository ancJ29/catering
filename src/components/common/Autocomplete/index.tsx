import { OptionProps } from "@/types";
import {
  AutocompleteProps,
  Autocomplete as MantineAutocomplete,
} from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import classes from "./Autocomplete.module.scss";
import { useMemo } from "react";

interface IAutocompleteProps extends AutocompleteProps {
  options?: OptionProps[];
  disabled?: boolean;
}

const Autocomplete = ({
  options,
  disabled,
  ...props
}: IAutocompleteProps) => {
  const data = useMemo(
    () => options?.map((el) => el.label),
    [options],
  );
  return (
    <MantineAutocomplete
      data={data}
      disabled={disabled ?? (options?.length || 0) < 1}
      rightSection={<IconChevronDown size={16} />}
      classNames={{
        input: "truncate",
        label: classes.label,
      }}
      {...props}
    />
  );
};

export default Autocomplete;
