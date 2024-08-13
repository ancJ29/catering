import useTranslation from "@/hooks/useTranslation";
import { Button, Flex } from "@mantine/core";
import Form from "./Form";
import Table from "./Table";

const ExportReceipt = () => {
  const t = useTranslation();

  return (
    <Flex direction="column" gap={10}>
      <Form />
      <Table />
      <Flex justify="end" mt={10}>
        <Button>{t("Export Inventory")}</Button>
      </Flex>
    </Flex>
  );
};

export default ExportReceipt;
