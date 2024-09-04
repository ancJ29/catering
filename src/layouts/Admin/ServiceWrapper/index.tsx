import useTranslation from "@/hooks/useTranslation";
import useAuthStore from "@/stores/auth.store";
import { Menu } from "@/types";
import { AppShell, Box, Burger, Button } from "@mantine/core";
import { useDisclosure, useWindowScroll } from "@mantine/hooks";
import { IconArrowUp } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { BrowserView } from "react-device-detect";
import { useLocation } from "react-router-dom";
import AdminHeader from "../AdminHeader";
import Navbar from "../Navbar";

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
  const [scroll, scrollTo] = useWindowScroll();
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
      <BrowserView>
        {scroll.y >= 10 && (
          <Button
            variant="outline"
            radius={999}
            p={0}
            w={40}
            h={40}
            pos="fixed"
            bottom="3rem"
            left={"50%"}
            onClick={() => scrollTo({ y: 0 })}
            bg="#ced4da"
          >
            <IconArrowUp />
          </Button>
        )}
      </BrowserView>
    </AppShell>
  );
};

export default ServiceWrapper;
