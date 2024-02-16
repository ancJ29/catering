import { CheckBoxOptions } from "@/types";
import { Checkbox as CheckBoxMantine, Flex } from "@mantine/core";
import { UseListStateHandlers } from "@mantine/hooks";

const CheckBox = ({
  multiple = false,
  options,
  handlers,
}: {
  multiple?: boolean;
  options: CheckBoxOptions[];
  handlers: UseListStateHandlers<CheckBoxOptions>;
}) => {
  const allChecked = options.every((value) => value.checked);

  const indeterminate =
    options.some((value) => value.checked) && !allChecked;

  const items = options.map((value, idx) => (
    <CheckBoxMantine
      label={value.label}
      key={value.key}
      checked={value.checked}
      onChange={(event) =>
        handlers.setItemProp(
          idx,
          "checked",
          event.currentTarget.checked,
        )
      }
    />
  ));

  return (
    <Flex direction="column" gap={10}>
      {multiple && options.length > 1 && (
        <CheckBoxMantine
          checked={allChecked}
          indeterminate={indeterminate}
          label="All"
          onChange={() =>
            handlers.setState((current) =>
              current.map((value) => ({
                ...value,
                checked: !allChecked,
              })),
            )
          }
        />
      )}
      {items}
    </Flex>
  );
};
export default CheckBox;
