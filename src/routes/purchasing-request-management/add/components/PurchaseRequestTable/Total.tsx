import useTranslation from "@/hooks/useTranslation";
import { numberWithDelimiter } from "@/utils";
import { Flex, Text, TextProps, Title } from "@mantine/core";
import { ReactNode } from "react";
import store from "../../_inventory.store";

const Total = () => {
  const t = useTranslation();

  return (
    <Flex
      justify="space-between"
      align="center"
      style={{ border: "1px solid #DEE2E6" }}
      p="8px"
    >
      <CustomText>{t("Total").toUpperCase()}</CustomText>
      <Title order={3}>
        {t("Quantity of material")}:{" "}
        <CustomText c="primary" span>
          {store.getTotalMaterial()}
        </CustomText>
      </Title>
      <Title order={3}>
        {t("Total")}:{" "}
        <CustomText c="primary" span>
          {numberWithDelimiter(store.getTotalPrice())}
        </CustomText>
      </Title>
    </Flex>
  );
};

export default Total;

interface CustomTextProps extends TextProps {
  children: ReactNode;
}

const CustomText = ({ children, ...props }: CustomTextProps) => {
  return (
    <Text fw={600} fz={22} {...props}>
      {children}
    </Text>
  );
};
