import useTranslation from "@/hooks/useTranslation";
import { Flex, Text, Title } from "@mantine/core";

const Description = () => {
  const t = useTranslation();

  return (
    <Flex direction="column" gap={5}>
      <Title fz={16} fw={300}>
        <Text span inherit fw="bold">
          {t("Note 1")}:
        </Text>{" "}
        {t("PO with status")}{" "}
        <Text span inherit fw="bold">
          {`"${t("Supplier rejected PO")}"`}{" "}
        </Text>
        {t("not included in this function")}
      </Title>
      <Title fz={16} fw={300}>
        <Text span inherit fw="bold">
          {t("Note 2")}:
        </Text>{" "}
        {t("When exporting")}{" "}
        <Text span inherit fw="bold">
          {t("all suppliers")}
          {", "}
        </Text>
        {t("or")}{" "}
        <Text span inherit fw="bold">
          {t("all caterings")}
          {", "}
        </Text>
        {t("system needs more time to calculate")}
      </Title>
    </Flex>
  );
};

export default Description;
