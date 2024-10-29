import useTranslation from "@/hooks/useTranslation";
import useAuthStore from "@/stores/auth.store";
import { AppShell, NavLink, Text } from "@mantine/core";
import { IconLogout, IconUser } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import classes from "./Logout.module.scss";

type FooterNavbarProps = {
  opened: boolean;
};

const FooterNavbar = ({ opened }: FooterNavbarProps) => {
  const t = useTranslation();
  const navigate = useNavigate();
  const { removeToken } = useAuthStore();
  const version = import.meta.env.APP_VERSION;
  const buildTime = import.meta.env.BUILD_TIME;

  const gotoProfilePage = () => {
    navigate("/profile");
  };

  const items = [
    {
      label: t("Profile"),
      icon: <IconUser strokeWidth="1.5" />,
      onClick: gotoProfilePage,
      hiddenFrom: "xs",
    },
    {
      label: t("Logout"),
      icon: <IconLogout strokeWidth="1.5" />,
      onClick: removeToken,
    },
  ];

  return (
    <AppShell.Section>
      {items.map((item, idx) => (
        <NavLink
          key={idx}
          h="3rem"
          onClick={item.onClick}
          label={opened ? item.label : ""}
          classNames={{ children: "c-catering-p-0" }}
          className={classes.container}
          leftSection={item.icon}
          hiddenFrom={item.hiddenFrom}
        />
      ))}
      {opened && (
        <Text fz="sm" c="dimmed" ta="right" pr={20} pb={5}>
          {`${t("Version")}: ${version} (${buildTime})`}
        </Text>
      )}
    </AppShell.Section>
  );
};

export default FooterNavbar;
