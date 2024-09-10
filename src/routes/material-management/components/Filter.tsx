import MaterialFilter from "@/components/c-catering/MaterialFilter";
import ResponsiveFilter from "@/components/c-catering/ResponsiveFilter";
import { FilterType } from "@/configs/filters/materials";
import { Flex } from "@mantine/core";

type FilterProps = {
  counter: number;
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
  setCondition: (
    value: React.SetStateAction<FilterType | undefined>,
  ) => void;
};

const Filter = ({
  counter,
  condition,
  keyword,
  names,
  filtered,
  reset,
  reload,
  updateCondition,
  setCondition,
}: FilterProps) => {
  const filterComponent = (
    <MaterialFilter
      type={condition?.type}
      group={condition?.group}
      keyword={keyword}
      materialNames={names}
      clearable={filtered}
      onClear={reset}
      onReload={reload}
      onChangeGroup={updateCondition.bind(null, "group", "")}
      onChangeType={(value) => {
        setCondition({
          type: value,
          group: "",
        });
      }}
    />
  );

  return (
    <>
      <Flex
        key={counter}
        justify="end"
        align="end"
        gap={10}
        visibleFrom="sm"
      >
        {filterComponent}
      </Flex>
      <ResponsiveFilter>{filterComponent}</ResponsiveFilter>
    </>
  );
};

export default Filter;
