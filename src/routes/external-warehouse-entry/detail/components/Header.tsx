import { Table } from "@mantine/core";

const Header = () => {
  return (
    <Table.Thead style={{ display: "table-footer-group" }}>
      <Table.Tr>
        <Table.Th w="3%" />
        <Table.Th w="20%" />
        <Table.Th w="5%" />
        <Table.Th w="7%" />
        <Table.Th w="7%" />
        <Table.Th w="13%" />
        <Table.Th w="10%" />
        <Table.Th w="10%" />
        <Table.Th w="10%" />
        <Table.Th w="15%" />
      </Table.Tr>
    </Table.Thead>
  );
};

export default Header;
