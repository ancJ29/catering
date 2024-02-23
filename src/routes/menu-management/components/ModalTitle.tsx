import { DailyMenuStatus } from "@/services/domain";
import { Box, Text } from "@mantine/core";
import Status from "./Status";

const ModalTitle = ({
  status,
  title,
}: {
  title: string;
  status?: DailyMenuStatus;
}) => {
  return (
    <Box>
      <Text fz="2rem" fw={900} c="primary">
        {title}
      </Text>
      {status && <Status fz={16} status={status} />}
    </Box>
  );
};

export default ModalTitle;
