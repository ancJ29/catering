import useTranslation from "@/hooks/useTranslation";
import { Flex, Table } from "@mantine/core";

const DisplayHeader = () => {
  const t = useTranslation();

  return (
    <Table.Thead>
      <Table.Tr>
        <Table.Th w="3%" ta="center" />
        <Table.Th w="20%" ta="center">
          {t("Material name")}
        </Table.Th>
        <Table.Th w="7%" ta="center">
          {t("Material unit")}
        </Table.Th>
        <Table.Th w="30%" ta="center">
          <Flex direction="column" justify="center" w="100%">
            <Flex
              justify="center"
              style={{ borderBottom: "1.5px solid #E5E8EB" }}
              p="5px 0"
            >
              {t("Quantity")}
            </Flex>
            <Flex pt="5px" w="100%" gap={5}>
              <Flex w="25%" justify="end" ta="end">
                {t("Received")}
              </Flex>
              <Flex w="26%" justify="end" ta="end">
                {t("Adjusted")}
              </Flex>
              <Flex w="49%" justify="center" ta="end">
                {t("Actual")}
              </Flex>
            </Flex>
          </Flex>
        </Table.Th>
        <Table.Th w="20%" ta="center">
          <Flex direction="column" justify="center">
            <Flex
              justify="center"
              style={{ borderBottom: "1.5px solid #E5E8EB" }}
              p="5px 0"
            >
              {t("Price")}
            </Flex>
            <Flex pt="5px" w="100%" gap={5}>
              <Flex w="47%" justify="end" ta="end">
                {t("Ordered")}
              </Flex>
              <Flex w="50%" justify="end" ta="end">
                {t("Adjusted")}
              </Flex>
            </Flex>
          </Flex>
        </Table.Th>
        <Table.Th w="20%" ta="center">
          {t("Supplier note")}
        </Table.Th>
      </Table.Tr>
    </Table.Thead>
  );
};

export default DisplayHeader;
