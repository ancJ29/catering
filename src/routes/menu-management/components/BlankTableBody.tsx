import EmptyBox from "@/components/common/EmptyBox";
import { Box, Table } from "@mantine/core";

const BlankTableBody = ({ mode }: { mode: "W" | "M" }) => {
  return (
    <Table.Tr>
      {mode === "W" && <Table.Td></Table.Td>}
      <Table.Td colSpan={mode === "W" ? 7 : 8}>
        <Box w="100%">
          <EmptyBox />
        </Box>
      </Table.Td>
    </Table.Tr>
  );
};

export default BlankTableBody;
