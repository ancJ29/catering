import useAuthStore from "@/stores/auth.store";
import {
  Card,
  Center,
  Flex,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { NavLink } from "react-router-dom";
import LanguageSelector from "../LanguageSelector";
import Logo from "../Logo";
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
            <Logo title={title} />
          </Title>
        </Center>
        <Flex align="center">
          <NavLink
            className="text-main"
            style={{ display: "flex" }}
            to="/profile"
          >
            <Text fw={700}>{user?.fullName || ""}</Text>
          </NavLink>
          <LanguageSelector />
          <UnstyledButton className={classes["logout-icon"]}>
            <IconLogout onClick={removeToken} />
          </UnstyledButton>
        </Flex>
      </Flex>
    </Card>
  );
};
export default AdminHeader;
