import useTranslation from "@/hooks/useTranslation";
import { Anchor, Flex, Text } from "@mantine/core";

const Logo = ({ title }: { title?: string }) => {
  const t = useTranslation();
  return (
    <Flex direction="row" align="center" gap={4}>
      <Anchor href="/dashboard" style={{ whiteSpace: "nowrap" }}>
        <Text fw="bolder" fz="1.25rem">
          C-Catering
          <Text
            pl=".3rem"
            fz="1.25rem"
            component="span"
            fw="normal"
            c="gray"
          >
            {title || t("Management")}
          </Text>
        </Text>
      </Anchor>
    </Flex>
  );
};
export default Logo;
