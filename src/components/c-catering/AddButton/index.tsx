import { ActionIcon, Affix, AffixProps } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

type AddButtonProps = {
  onClick: () => void;
} & AffixProps;

const AddButton = ({ onClick, ...props }: AddButtonProps) => {
  return (
    <Affix position={{ bottom: 16, right: 16 }} {...props}>
      <ActionIcon radius="xl" size={40} onClick={onClick}>
        <IconPlus size={24} color="white" />
      </ActionIcon>
    </Affix>
  );
};

export default AddButton;
