import useTranslation from "@/hooks/useTranslation";
import { Button, Drawer, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

type ResponsiveFilterProps = {
  children?: React.ReactNode;
};

const ResponsiveFilter = ({ children }: ResponsiveFilterProps) => {
  const t = useTranslation();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Flex justify="end" align="end" hiddenFrom="sm">
      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        size="xs"
        hiddenFrom="sm"
      >
        <Flex direction="column" gap={10}>
          {children}
        </Flex>
      </Drawer>
      <Button onClick={open}>{t("Filter")}</Button>
    </Flex>
  );
};

export default ResponsiveFilter;
