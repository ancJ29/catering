import useTranslation from "@/hooks/useTranslation";
import { Button, Flex } from "@mantine/core";
import { useNavigate } from "react-router-dom";

type WarehouseEntryActionsProps = {
  returnTittle?: string;
  returnUrl: string;
  resetTitle?: string;
  onReset: () => void;
  changed?: boolean;
  completeTitle?: string;
  onCompleted: () => void;
  disabled?: boolean;
};

const WarehouseEntryActions = ({
  returnTittle,
  returnUrl,
  resetTitle,
  onReset,
  changed = false,
  completeTitle,
  onCompleted,
  disabled = false,
}: WarehouseEntryActionsProps) => {
  const t = useTranslation();
  const navigate = useNavigate();

  const onReturn = () => {
    navigate(returnUrl, { state: { refresh: true } });
  };

  return (
    <Flex justify="space-between">
      <Button variant="outline" onClick={onReturn}>
        {t(returnTittle || "Return")}
      </Button>
      <Flex gap={10}>
        <Button onClick={onReset} disabled={!changed}>
          {t(resetTitle || "Reset")}
        </Button>
        <Button onClick={onCompleted} disabled={disabled}>
          {t(completeTitle || "Complete")}
        </Button>
      </Flex>
    </Flex>
  );
};

export default WarehouseEntryActions;
