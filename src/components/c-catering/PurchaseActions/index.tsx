import useTranslation from "@/hooks/useTranslation";
import { Button, Flex } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

type PurchaseActionsProps = {
  returnButtonTitle?: string;
  returnUrl: string;
  completeButtonTitle: string;
  complete: () => void;
  disabledCompleteButton?: boolean;
  rejectButtonTitle?: string;
  onReject?: () => void;
  disabledRejectButton?: boolean;
  showCompleteAndRejectButton?: boolean;
};

const PurchaseActions = ({
  returnButtonTitle = "Return",
  returnUrl,
  completeButtonTitle,
  complete,
  disabledCompleteButton = false,
  rejectButtonTitle,
  onReject,
  disabledRejectButton = false,
  showCompleteAndRejectButton = true,
}: PurchaseActionsProps) => {
  const t = useTranslation();
  const navigate = useNavigate();

  const onReturn = () => {
    navigate(returnUrl, { state: { refresh: true } });
  };

  return (
    <Flex justify="end" align="end" gap={10}>
      {showCompleteAndRejectButton && (
        <>
          {rejectButtonTitle && (
            <Button
              leftSection={<IconX size={16} />}
              color="error.4"
              onClick={onReject}
              disabled={disabledRejectButton}
            >
              {t(rejectButtonTitle)}
            </Button>
          )}
          <Button
            leftSection={<IconCheck size={16} />}
            onClick={complete}
            disabled={disabledCompleteButton}
          >
            {t(completeButtonTitle)}
          </Button>
        </>
      )}
      <Button onClick={onReturn} variant="outline">
        {t(returnButtonTitle)}
      </Button>
    </Flex>
  );
};

export default PurchaseActions;
