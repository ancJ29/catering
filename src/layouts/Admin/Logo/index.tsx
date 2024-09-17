import useTranslation from "@/hooks/useTranslation";
import { Anchor, Flex, Text } from "@mantine/core";

const Logo = ({ title }: { title?: string }) => {
  const t = useTranslation();
  return (
    <Flex direction="row" align="center" gap={5} pl="xs" w="100%">
      <Anchor
        href="/dashboard"
        style={{ whiteSpace: "nowrap" }}
        w="100%"
      >
        <Flex fw="bolder" fz="1.25rem" w="100%">
          <Flex visibleFrom="xs">C-Catering</Flex>
          <Text
            pl=".3rem"
            fz="1.25rem"
            component="span"
            w="100%"
            fw={{ base: "bold", xs: "normal" }}
            c={{ base: "black", xs: "gray" }}
            ta={{ base: "center", xs: "left" }}
          >
            {title || t("Management")}
          </Text>
        </Flex>
      </Anchor>
    </Flex>
  );
};
export default Logo;
