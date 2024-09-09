import { ActionIcon } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { IconArrowUp } from "@tabler/icons-react";
import classes from "./ScrollTopTopButton.module.scss";

const ScrollToTopButton = () => {
  const [scroll, scrollTo] = useWindowScroll();

  const scrollToTop = () => {
    scrollTo({ y: 0 });
  };

  return (
    scroll.y >= 10 && (
      <ActionIcon
        variant="outline"
        radius="xl"
        onClick={scrollToTop}
        className={classes.button}
      >
        <IconArrowUp />
      </ActionIcon>
    )
  );
};

export default ScrollToTopButton;
