import useTranslation from "@/hooks/useTranslation";
import useAuthStore from "@/stores/auth.store";
import { Menu } from "@/types";
import { AppShell, Box, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AdminHeader from "../AdminHeader";
import Navbar from "../Navbar";
import ScrollToTopButton from "../ScrollToTopButton";

type Props = {
  routeGroup?: string;
  title?: string;
  isTranslate?: boolean;
  children: React.ReactNode;
};

const ServiceWrapper = ({
  routeGroup,
  title,
  isTranslate = true,
  children,
}: Props) => {
  const t = useTranslation();
  const location = useLocation();
  const [opened, { toggle, close, open }] = useDisclosure(false);
  const { user } = useAuthStore();
  const [menu] = useState<Menu>(user?.menu || []);

  useEffect(close, [close, location.key]);

  return (
    <AppShell
      mih="100vh"
      header={{ height: "4.5rem" }}
      navbar={{
        width: opened ? 300 : 60,
        breakpoint: "sm",
        collapsed: {
          mobile: !opened,
          desktop: false,
        },
      }}
    >
      <AppShell.Header withBorder={false}>
        <AdminHeader
          title={isTranslate ? t(title) : title}
          burger={
            <Burger opened={opened} onClick={toggle} size="sm" />
          }
        />
      </AppShell.Header>
      <AppShell.Navbar>
        <Navbar
          opened={opened}
          menu={menu}
          onOpenNavbar={open}
          routeGroup={routeGroup}
        />
      </AppShell.Navbar>
      <AppShell.Main>
        <Box
          mah={"calc(100vh - 4.5rem)"}
          style={{
            height: "auto",
            width: "100%",
            padding: "10px",
          }}
        >
          {children}
        </Box>
      </AppShell.Main>
      <ScrollToTopButton />
    </AppShell>
  );
};

export default ServiceWrapper;
