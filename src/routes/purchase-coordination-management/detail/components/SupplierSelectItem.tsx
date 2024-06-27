import useTranslation from "@/hooks/useTranslation";
import { numberWithDelimiter } from "@/utils";
import { Stack, Text } from "@mantine/core";
import { SupplierSelectItemData } from "../_config";

const SupplierSelectItem = ({
  supplierName,
  unitName,
  price,
}: SupplierSelectItemData) => {
  const t = useTranslation();
  return (
    <Stack gap={0} justify="start" align="start">
      <Text fw={600} ta="start">{`${t(
        "Name",
      )}: ${supplierName}`}</Text>
      <Text ta="start">{`${t(
        "Sup specifications",
      )}: ${unitName}`}</Text>
      <Text fw={600} c="primary" ta="start">{`${t(
        "Price",
      )}: ${numberWithDelimiter(price)}/${unitName}`}</Text>
    </Stack>
  );
};

export default SupplierSelectItem;
