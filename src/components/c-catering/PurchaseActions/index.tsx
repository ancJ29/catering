import useTranslation from "@/hooks/useTranslation";
import { Button, Flex } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

type PurchaseActionsProps = {
  returnButtonTitle: string;
  returnUrl: string;
  complete: () => void;
};

const PurchaseActions = ({
  returnButtonTitle,
  returnUrl,
  complete,
}: PurchaseActionsProps) => {
  const t = useTranslation();
  const navigate = useNavigate();
  return (
    <Flex justify="end" align="end" gap={10}>
      <Button onClick={() => navigate(returnUrl)} variant="outline">
        {returnButtonTitle}
      </Button>
      <Button
        leftSection={<IconCheck size={16} />}
        onClick={complete}
      >
        {t("Complete")}
      </Button>
    </Flex>
  );
};

export default PurchaseActions;
