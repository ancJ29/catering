import useTranslation from "@/hooks/useTranslation";
import { Checkbox, Flex, Table } from "@mantine/core";

type DisplayHeaderProps = {
  isCheckAll: boolean;
  onChangeCheckAll: (value: boolean) => void;
};

const DisplayHeader = ({
  isCheckAll,
  onChangeCheckAll,
}: DisplayHeaderProps) => {
  const t = useTranslation();
  return (
    <Table.Thead>
      <Table.Tr>
        <Table.Th w="3%" ta="center" />
        <Table.Th w="20%" ta="center">
          {t("Material name")}
        </Table.Th>
        <Table.Th w="5%" ta="center">
          {t("Material unit")}
        </Table.Th>
        <Table.Th w="27%" ta="center">
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
                <Flex w="80%" ml={10} justify="center">
                  {t("Actual")}
                </Flex>
                <Checkbox
                  checked={isCheckAll}
                  onChange={(event) =>
                    onChangeCheckAll(event.currentTarget.checked)
                  }
                />
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
        <Table.Th w="10%" ta="center">
          {t("Expiry date")}
        </Table.Th>
        <Table.Th w="15%" ta="center">
          {t("Supplier note")}
        </Table.Th>
      </Table.Tr>
    </Table.Thead>
  );
};

export default DisplayHeader;
