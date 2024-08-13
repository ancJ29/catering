import { Stack } from "@mantine/core";
import { useEffect } from "react";
import store from "./_export.store";
import Form from "./components/Form";
import TabController from "./components/TabController";

const ExportInventory = () => {
  useEffect(() => {
    store.initData();
  }, []);

  return (
    <Stack gap={10}>
      <Form />
      <TabController />
    </Stack>
  );
};

export default ExportInventory;
