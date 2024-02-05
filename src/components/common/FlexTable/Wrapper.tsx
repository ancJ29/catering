import { Table } from "@mantine/core";
import { isMobile } from "react-device-detect";

const Wrapper = ({
  tableWrapperClassName,
  children,
}: {
  tableWrapperClassName?: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      {isMobile ? (
        <>{children}</>
      ) : (
        <Table.ScrollContainer
          minWidth={500}
          className={tableWrapperClassName}
          p={0}
          mt={20}
          w="100%"
        >
          {children}
        </Table.ScrollContainer>
      )}
    </>
  );
};

export default Wrapper;
