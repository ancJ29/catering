import useTranslation from "@/hooks/useTranslation";
import { ActionIcon, Affix, Button, Flex } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const AddButton = () => {
  const t = useTranslation();
  const navigate = useNavigate();

  const onClick = () => {
    navigate("/purchase-request-management/add");
  };

  return (
    <>
      <Affix position={{ bottom: 16, right: 16 }} hiddenFrom="sm">
        <ActionIcon radius="xl" size={40} onClick={onClick}>
          <IconPlus size={24} color="white" />
        </ActionIcon>
      </Affix>
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

export default AddButton;
