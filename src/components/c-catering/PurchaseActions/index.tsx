import { Button, Flex } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

type PurchaseActionsProps = {
  returnButtonTitle: string;
  returnUrl: string;
  completeButtonTitle: string;
  complete: () => void;
  disabledCompleteButton?: boolean;
};

const PurchaseActions = ({
  returnButtonTitle,
  returnUrl,
  completeButtonTitle,
  complete,
  disabledCompleteButton = false,
}: PurchaseActionsProps) => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate(returnUrl);
    window.location.reload();
  };

  return (
    <Flex justify="end" align="end" gap={10}>
      <Button onClick={onClick} variant="outline">
        {returnButtonTitle}
      </Button>
      <Button
        leftSection={<IconCheck size={16} />}
        onClick={complete}
        disabled={disabledCompleteButton}
      >
        {completeButtonTitle}
      </Button>
    </Flex>
  );
};

export default PurchaseActions;
