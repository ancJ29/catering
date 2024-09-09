import useAuthStore from "@/stores/auth.store";
import { getInitials } from "@/utils";
import {
  Avatar,
  Card,
  Center,
  Flex,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { NavLink } from "react-router-dom";
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
  const { removeToken } = useAuthStore();

  return (
    <Card h="4.5rem" className={classes.wrapper}>
      <Flex display="flex" align="stretch" justify={"space-between"}>
        <Center>
          {burger}
          <Title pl="xs" size="1.2rem">
            <Logo title={title?.toUpperCase()} />
          </Title>
        </Center>
        <Flex align="center" gap={8}>
          <LanguageSelector />
          <Notice />
          <NavLink className="c-catering-text-main" to="/profile">
            <Avatar color="primary" radius="xl">
              {getInitials(user?.fullName || "")}
            </Avatar>
          </NavLink>
          <UnstyledButton className={classes["logout-icon"]}>
            <IconLogout onClick={removeToken} />
          </UnstyledButton>
        </Flex>
      </Flex>
    </Card>
  );
};
export default AdminHeader;
