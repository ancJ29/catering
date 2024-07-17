import useTranslation from "@/hooks/useTranslation";
import { Button, Flex } from "@mantine/core";
import { IconDeviceFloppy, IconPhoto } from "@tabler/icons-react";

const Controls = () => {
  const t = useTranslation();
  return (
    <Flex gap={10}>
      <Button leftSection={<IconDeviceFloppy size={16} />}>
        {t("Save information")}
      </Button>
      <Button variant="outline" leftSection={<IconPhoto size={16} />}>
        {t("Attached file")}
      </Button>
    </Flex>
  );
};

export default Controls;
