import { Box, Center, Loader } from "@mantine/core";
import { useCallback } from "react";
import { isMobile } from "react-device-detect";
import InfiniteScroll from "react-infinite-scroll-component";

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
    <div id="scrollableDiv" style={{ overflow: "auto" }}>
      <InfiniteScroll
        dataLength={dataLength}
        next={next}
        hasMore={hasMore}
        scrollableTarget={isMobile ? "" : "scrollableDiv"}
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
