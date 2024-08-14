import useTranslation from "@/hooks/useTranslation";
import { Button, Flex } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import store from "../../_export.store";
import Form from "./Form";
import Table from "./Table";

const ExportReceipt = () => {
  const t = useTranslation();

  const complete = async () => {
    const isValidExportReceipt = store.isValidExportReceipt();
    const isValidAmount = store.isValidAmount();
    if (!isValidExportReceipt) {
      notifications.show({
        color: "red.5",
        message: t("Please check type of export receipt"),
      });
    } else if (!isValidAmount) {
      notifications.show({
        color: "red.5",
        message: t("Please check all the amounts of materials"),
      });
    } else {
      const result = await store.exportReceipt();
      result &&
        notifications.show({
          color: "green.5",
          message: t("Add export successfully"),
        });
      // setTimeout(() => {
      //   window.location.reload();
      // }, 800);
    }
  };

  return (
    <Flex direction="column" gap={10}>
      <Form />
      <Table />
      <Flex justify="end" mt={10}>
        <Button onClick={complete}>{t("Export Inventory")}</Button>
      </Flex>
    </Flex>
  );
};

export default ExportReceipt;
