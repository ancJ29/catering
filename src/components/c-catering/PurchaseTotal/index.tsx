import useTranslation from "@/hooks/useTranslation";
import { numberWithDelimiter } from "@/utils";
import { Flex, Text, TextProps, Title } from "@mantine/core";
import { ReactNode } from "react";

type PurchaseTotalProps = {
  totalMaterial: number;
  totalPrice: number;
};

const PurchaseTotal = ({
  totalMaterial,
  totalPrice,
}: PurchaseTotalProps) => {
  const t = useTranslation();
  return (
    <Flex
      justify="space-between"
      align="center"
      style={{ border: "1px solid #DEE2E6" }}
      p="8px"
    >
      <CustomText>{t("Total").toUpperCase()}</CustomText>
      <Title order={4}>
        {t("Quantity of material")}:{" "}
        <CustomText c="primary" span>
          {totalMaterial}
        </CustomText>
      </Title>
      <Title order={4}>
        {t("Total")}:{" "}
        <CustomText c="primary" span>
          {numberWithDelimiter(totalPrice)}
        </CustomText>
      </Title>
    </Flex>
  );
};

export default PurchaseTotal;

interface CustomTextProps extends TextProps {
  children: ReactNode;
}

const CustomText = ({ children, ...props }: CustomTextProps) => {
  return (
    <Text fw={600} fz={20} {...props}>
      {children}
    </Text>
  );
};
