import useTranslation from "@/hooks/useTranslation";
import { Button, Flex, Text } from "@mantine/core";

const color = "#F66C6D";

const PendingOrderActions = () => {
  const t = useTranslation();

  return (
    <Flex gap={10} direction="column" align="end">
      <Text fw="500" c="primary">
        {t("Incomplete Ticket")}
      </Text>
      <Flex gap={10}>
        <Button color={color} disabled>
          {`${t("Dispatch to project")} (0)`}
        </Button>
        <Button color={color} disabled>
          {`${t("Receive from project")} (0)`}
        </Button>
        <Button color={color} disabled>
          {`${t("Receive from supplier")} (0)`}
        </Button>
      </Flex>
    </Flex>
  );
};

export default PendingOrderActions;
