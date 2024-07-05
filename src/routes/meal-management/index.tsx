import CustomButton from "@/components/c-catering/CustomButton";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import { Box, Flex, Stack } from "@mantine/core";
import { useCallback } from "react";
import store from "./_meal.store";
import Form from "./components/Form";
import Table from "./components/Table";

const MealManagement = () => {
  const t = useTranslation();
  const load = useCallback(() => {
    store.initData();
  }, []);
  useOnMounted(load);

  const save = useCallback(() => {
    store.save();
  }, []);

  return (
    <Stack gap={0}>
      <Flex direction="column" gap={10}>
        <Box ta="right">
          <CustomButton onClick={save} confirm>
            {t("Save")}
          </CustomButton>
        </Box>
        <Form />
        <Table />
      </Flex>
    </Stack>
  );
};

export default MealManagement;
