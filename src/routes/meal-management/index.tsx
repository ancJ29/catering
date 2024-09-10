import CustomButton from "@/components/c-catering/CustomButton";
import useTranslation from "@/hooks/useTranslation";
import { Box, Flex, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useCallback } from "react";
import store from "./_meal.store";
import Filter from "./components/Filter";
import Table from "./components/Table";

const MealManagement = () => {
  const t = useTranslation();
  const save = useCallback(async () => {
    await store.save();
    notifications.show({
      color: "blue.5",
      message: t("Your changes have been saved"),
    });
  }, [t]);

  return (
    <Stack gap={0}>
      <Flex direction="column" gap={10}>
        <Box ta="right">
          <CustomButton onClick={save} confirm>
            {t("Save")}
          </CustomButton>
        </Box>
        <Filter />
        <Table />
      </Flex>
    </Stack>
  );
};

export default MealManagement;
