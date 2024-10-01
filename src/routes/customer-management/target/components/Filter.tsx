import AutocompleteForFilterData from "@/components/c-catering/AutocompleteForFilterData";
import useTranslation from "@/hooks/useTranslation";
import { Flex } from "@mantine/core";

type FilterProps = {
  names: string[];
  reload: () => void;
};

const Filter = ({ names, reload }: FilterProps) => {
  const t = useTranslation();

  return (
    <Flex justify="end" align="end" gap={10}>
      <AutocompleteForFilterData
        data={names}
        label={t("Meal target audience")}
        onReload={reload}
        w="20vw"
      />
    </Flex>
  );
};

export default Filter;
