import useAuthStore from "@/stores/auth.store";
import { Card, Flex } from "@mantine/core";
import Avatar from "../Avatar";
import LanguageSelector from "../LanguageSelector";
import Logo from "../Logo";
import Notice from "../Notice";
import classes from "./AdminHeader.module.scss";

const AdminHeader = ({
  title,
  burger,
}: {
  title?: string;
  burger: React.ReactNode;
}) => {
  const { user } = useAuthStore();

  return (
    <Card
      h={{ base: "3.5rem", xs: "4.5rem" }}
      className={classes.wrapper}
    >
      <Flex display="flex" align="stretch" justify={"space-between"}>
        <Flex align="center" w="100%">
          {burger}
          <Logo title={title?.toUpperCase()} />
        </Flex>
        <Flex align="center" gap={8}>
          <LanguageSelector />
          <Notice />
          <Avatar user={user} />
        </Flex>
      </Flex>
    </Card>
  );
};
export default AdminHeader;
