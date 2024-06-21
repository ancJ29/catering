import useTranslation from "@/hooks/useTranslation";
import { Button, Flex } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

type PurchaseActionsProps = {
  returnButtonTitle: string;
  returnUrl: string;
  complete: () => void;
  disabledCompleteButton?: boolean;
};

const PurchaseActions = ({
  returnButtonTitle,
  returnUrl,
  complete,
  disabledCompleteButton = false,
}: PurchaseActionsProps) => {
  const t = useTranslation();
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
        {t("Complete")}
      </Button>
    </Flex>
  );
};

export default PurchaseActions;
