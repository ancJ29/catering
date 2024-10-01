import AutocompleteForFilterData from "@/components/c-catering/AutocompleteForFilterData";
import CustomButton from "@/components/c-catering/CustomButton";
import useTranslation from "@/hooks/useTranslation";
import { Flex } from "@mantine/core";

type FilterProps = {
  changed: boolean;
  save: () => void;
  names: string[];
  reload: () => void;
};

const Filter = ({ changed, save, names, reload }: FilterProps) => {
  const t = useTranslation();

  return (
    <Flex justify="end" align="end" gap={10}>
      <AutocompleteForFilterData
        data={names}
        label={t("Product")}
        onReload={reload}
        w={{ base: "50%", sm: "20rem" }}
      />
      <CustomButton
        disabled={!changed}
        onClick={save}
        confirm
        hiddenFrom="xs"
      >
        {t("Save")}
      </CustomButton>
    </Flex>
  );
};

export default Filter;
