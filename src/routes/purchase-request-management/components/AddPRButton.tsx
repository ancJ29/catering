import AddButton from "@/components/c-catering/AddButton";
import useTranslation from "@/hooks/useTranslation";
import { Button, Flex } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const AddPRButton = () => {
  const t = useTranslation();
  const navigate = useNavigate();

  const onClick = () => {
    navigate("/purchase-request-management/add");
  };

  return (
    <>
      <AddButton onClick={onClick} hiddenFrom="sm" />
      <Flex justify="end" align="end" visibleFrom="sm">
        <Button
          onClick={onClick}
          leftSection={<IconPlus size={16} />}
        >
          {t("Add purchase request")}
        </Button>
      </Flex>
    </>
  );
};

export default AddPRButton;
