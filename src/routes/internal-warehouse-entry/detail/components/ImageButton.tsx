import useTranslation from "@/hooks/useTranslation";
import { Button, Flex } from "@mantine/core";
import { IconPaperclip, IconPhoto } from "@tabler/icons-react";

const ImageButton = () => {
  const t = useTranslation();
  return (
    <Flex justify="start" gap={10} mt={10}>
      <Button leftSection={<IconPaperclip size={16} />}>
        {t("Attach image")}
      </Button>
      <Button leftSection={<IconPhoto size={16} />}>
        {t("View attached image")}
      </Button>
    </Flex>
  );
};

export default ImageButton;
