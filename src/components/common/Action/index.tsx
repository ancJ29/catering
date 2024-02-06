import { Flex, UnstyledButton } from "@mantine/core";
import { IconCopy, IconEdit, IconTrash } from "@tabler/icons-react";

type Props = {
  title?: string;
  description?: string;
  justify?: string;
  onClone?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  disable?: boolean;
};
const Action = ({
  justify = "end",
  disable,
  onClone,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <Flex
      gap={3}
      px={2}
      justify={justify}
      opacity={disable ? 0.6 : 1}
    >
      <UnstyledButton disabled={!onDelete} onClick={onDelete}>
        <IconTrash strokeWidth="1.5" color="black" />
      </UnstyledButton>
      <UnstyledButton disabled={!onEdit} onClick={onEdit}>
        <IconEdit strokeWidth="1.5" color="black" />
      </UnstyledButton>
      <UnstyledButton disabled={!onClone} onClick={onClone}>
        <IconCopy strokeWidth="1.5" color="black" />
      </UnstyledButton>
    </Flex>
  );
};
export default Action;
