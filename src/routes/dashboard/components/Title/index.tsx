import useTranslation from "@/hooks/useTranslation";
import { Flex, Text } from "@mantine/core";
import { TablerIconsProps } from "@tabler/icons-react";

type TitleProps = {
  icon: (props: TablerIconsProps) => JSX.Element;
  title: string;
};

const Title = ({ icon: Icon, title }: TitleProps) => {
  const t = useTranslation();
  return (
    <Flex gap={5} align="center">
      <Icon strokeWidth="1.5" />
      <Text fw="bold">{t(title)}</Text>
    </Flex>
  );
};

export default Title;
