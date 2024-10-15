import useTranslation from "@/hooks/useTranslation";
import { Affix, AffixProps, Button, Flex } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import ActionIcon from "../ActionIcon";

type AddButtonProps = {
  label?: string;
  onClick: () => void;
} & AffixProps;

const AddButton = ({ label, onClick, ...props }: AddButtonProps) => {
  const t = useTranslation();
  return (
    <>
      <Flex justify="end" visibleFrom="sm">
        <Button onClick={onClick}>{t(label)}</Button>
      </Flex>
      <Affix
        position={{ bottom: 16, right: 16 }}
        {...props}
        hiddenFrom="sm"
      >
        <ActionIcon
          variant="filled"
          radius="xl"
          size={40}
          onClick={onClick}
        >
          <IconPlus size={24} color="white" />
        </ActionIcon>
      </Affix>
    </>
  );
};

export default AddButton;
