import AutocompleteForFilterData from "@/components/c-catering/AutocompleteForFilterData";
import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import { OptionProps } from "@/types";
import { Flex } from "@mantine/core";
import { useMemo } from "react";
import { NOT_SERVED, SERVED } from "../_configs";

type FilterProps = {
  names: string[];
  reload: () => void;
  served?: string;
  onChangeServed: (value: string) => void;
};

const Filter = ({
  names,
  reload,
  served,
  onChangeServed,
}: FilterProps) => {
  const t = useTranslation();
  const servedList: OptionProps[] = useMemo(
    () => [
      {
        value: SERVED,
        label: t("Served"),
      },
      {
        value: NOT_SERVED,
        label: t("Not served"),
      },
    ],
    [t],
  );

  return (
    <Flex justify="end" align="end" gap={10}>
      <AutocompleteForFilterData
        data={names}
        label={t("Product")}
        onReload={reload}
        w="20vw"
      />
      <Select
        value={served}
        label={t("Served")}
        w="20vw"
        options={servedList}
        onChange={(value) => onChangeServed(value || "")}
      />
    </Flex>
  );
};

export default Filter;
