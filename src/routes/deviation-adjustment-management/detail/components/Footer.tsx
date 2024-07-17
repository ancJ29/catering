import useTranslation from "@/hooks/useTranslation";
import { numberWithDelimiter } from "@/utils";
import { Stack, Text } from "@mantine/core";

type FooterProps = {
  totalAmount: number;
  taxAmount: number;
};

const Footer = ({ totalAmount, taxAmount }: FooterProps) => {
  const t = useTranslation();

  return (
    <Stack align="end" gap={0}>
      <Text fw={900} fz={18}>{`${t(
        "Total amount",
      )}: ${numberWithDelimiter(totalAmount)}`}</Text>
      <Text fw={900} fz={18}>{`${t(
        "Tax amount",
      )}: ${numberWithDelimiter(taxAmount)}`}</Text>
      <Text fw={900} fz={18}>{`${t(
        "Total payment",
      )}: ${numberWithDelimiter(totalAmount + taxAmount)}`}</Text>
    </Stack>
  );
};

export default Footer;
