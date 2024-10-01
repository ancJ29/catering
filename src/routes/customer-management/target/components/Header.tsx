import CustomButton from "@/components/c-catering/CustomButton";
import useTranslation from "@/hooks/useTranslation";
import { Customer } from "@/services/domain";
import { Flex, Text } from "@mantine/core";

type HeaderProps = {
  customer?: Customer;
  changed: boolean;
  save: () => void;
};

const Header = ({ customer, changed, save }: HeaderProps) => {
  const t = useTranslation();
  return (
    <Flex
      direction={{ base: "column", sm: "row" }}
      w="100%"
      align={{ base: "center", sm: "center" }}
      justify={{ base: "start", xs: "space-between" }}
    >
      <Text className="c-catering-font-bold" size="2rem">
        {customer?.name || "-"} - {t("Product")}
      </Text>
      <CustomButton
        disabled={!changed}
        onClick={save}
        confirm
        visibleFrom="xs"
      >
        {t("Save")}
      </CustomButton>
    </Flex>
  );
};

export default Header;
