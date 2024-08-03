import useTranslation from "@/hooks/useTranslation";
import { Button, Flex } from "@mantine/core";
import {
  IconDeviceFloppy,
  IconPaperclip,
  IconPhoto,
} from "@tabler/icons-react";

const ImageButton = () => {
  const t = useTranslation();
  return (
    <Flex justify="space-between" gap={10} mt={10}>
      <Flex gap={10}>
        <Button leftSection={<IconPaperclip size={16} />}>
          {t("Attach image")}
        </Button>
        <Button leftSection={<IconPhoto size={16} />}>
          {t("View attached image")}
        </Button>
      </Flex>
      <Button
        color="blue.4"
        leftSection={<IconDeviceFloppy size={16} />}
      >
        {t("Save general information")}
      </Button>
    </Flex>
  );
};

export default ImageButton;
