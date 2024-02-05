import { Box, Center, Loader } from "@mantine/core";
import { useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import classes from "./InfiniteScroll.module.scss";

type ScrollProps = {
  dataLength?: number;
  handleScroll?: () => void;
  rows: React.ReactNode;
  hasMore?: boolean;
};
const Scroll = ({
  dataLength = 0,
  handleScroll,
  rows,
  hasMore = false,
}: ScrollProps) => {
  const next = useCallback(() => {
    handleScroll && handleScroll();
  }, [handleScroll]);

  return (
    <div className={classes.container}>
      <InfiniteScroll
        dataLength={dataLength}
        next={next}
        hasMore={hasMore}
        loader={
          <Center>
            <Loader />
          </Center>
        }
        style={{ overflow: "hidden" }}
      >
        <Box>{rows}</Box>
      </InfiniteScroll>
    </div>
  );
};
export default Scroll;
