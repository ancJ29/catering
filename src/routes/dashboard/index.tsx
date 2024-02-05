import useTranslation from "@/hooks/useTranslation";
import { Box, Center } from "@mantine/core";

const Dashboard = () => {
  const t = useTranslation();
  return (
    <Center bg="gray.1" w="100%" h="100%">
      <Box w={"30vw"} ta={"center"}>
        {t("Dashboard")}
      </Box>
    </Center>
  );
};

export default Dashboard;
