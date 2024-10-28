import { stopMouseEvent } from "@/utils";
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
  const handleClick = (e: React.MouseEvent, action?: () => void) => {
    stopMouseEvent(e);
    action && action();
  };

  return (
    <Flex gap={5} justify={justify} opacity={disable ? 0.6 : 1}>
      {onDelete && (
        <UnstyledButton
          disabled={!onDelete}
          onClick={(e) => handleClick(e, onDelete)}
        >
          <IconTrash strokeWidth="1.5" color="black" />
        </UnstyledButton>
      )}
      {onEdit && (
        <UnstyledButton
          disabled={!onEdit}
          onClick={(e) => handleClick(e, onEdit)}
        >
          <IconEdit strokeWidth="1.5" color="black" />
        </UnstyledButton>
      )}
      {onClone && (
        <UnstyledButton
          disabled={!onClone}
          onClick={(e) => handleClick(e, onClone)}
        >
          <IconCopy strokeWidth="1.5" color="black" />
        </UnstyledButton>
      )}
    </Flex>
  );
};
export default Action;
