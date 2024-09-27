import { prStatusSchema } from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import {
  getPurchaseRequests,
  PurchaseRequest,
} from "@/services/domain";
import { Menu, MenuItem } from "@/types";
import { AppShell, Box, NavLink, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Icon from "./Icon";
import classes from "./navbar.module.scss";

// TODO: remove debug
// const debug = window.location.hostname.includes("localhost");
const debug = true;
const supplyCoordinationKey = "supply-coordination";

type NavbarProps = {
  opened?: boolean;
  menu: Menu;
  level?: number;
  onOpenNavbar?: () => void;
  routeGroup?: string;
};
const Navbar = ({
  level = 1,
  opened,
  menu,
  onOpenNavbar,
  routeGroup,
}: NavbarProps) => {
  const t = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);
  const [activeKey, setActiveKey] = useState("");
  const [_menu, setMenu] = useState<Menu>([]);
  const [pr, setPR] = useState<PurchaseRequest[]>([]);

  const getData = async (from?: number, to?: number) => {
    setPR(
      await getPurchaseRequests(from, to, prStatusSchema.Values.DD),
    );
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setActive(location.pathname);
    setActiveKey("");
    if (
      routeGroup &&
      routeGroup !== "*" &&
      !_hasRouteGroup(menu, routeGroup)
    ) {
      navigate("/");
    }
  }, [routeGroup, location.pathname, menu, navigate]);

  useEffect(() => {
    setMenu(
      menu.filter((el) => {
        if (debug) {
          if (el.url) {
            return true;
          }
          if (el.subs?.length) {
            return !!el.subs.find((el) => !!el.url);
          }
          return false;
        }
        return true;
      }),
    );
  }, [menu]);

  const open = useCallback(
    (item: { key: string; url?: string; subs?: unknown[] }) => {
      if (item.subs) {
        setActiveKey((prev) => (prev === item.key ? "" : item.key));
        return;
      }
      if (!item.url) {
        modals.open({
          withCloseButton: false,
          children: (
            <Text size="sm" c="red.5" fw={800} w="100%" ta="center">
              {t("Sorry, this feature is implemented yet")}
            </Text>
          ),
        });
        return;
      }
      navigate(item.url);
    },
    [navigate, t],
  );

  if (!_menu.length) {
    return <></>;
  }

  return (
    <AppShell.Section grow>
      <Box
        className={classes.wrapper}
        pb={level === 1 ? "2rem" : "0"}
        onClick={onOpenNavbar}
      >
        {_menu.map((item, idx) => {
          const isActive = _isActive(item, active);
          return (
            <NavLink
              opened={item.subs && activeKey === item.key}
              key={idx}
              h="3rem"
              onClick={open.bind(null, item)}
              label={
                opened
                  ? `${t(item.label)}${
                    item.key === supplyCoordinationKey
                      ? ` (${pr.length})`
                      : ""
                  }`
                  : ""
              }
              classNames={{
                children: "c-catering-p-0",
              }}
              className={clsx(
                classes.item,
                isActive ? classes.active : "",
              )}
              leftSection={<Icon {...item} disabled={opened} />}
            >
              {item.subs && opened && (
                <Navbar
                  opened
                  level={level + 1}
                  menu={item.subs || []}
                />
              )}
            </NavLink>
          );
        })}
      </Box>
    </AppShell.Section>
  );
};
export default Navbar;

function _isActive(item: MenuItem, activeUrl: string): boolean {
  if (activeUrl === item.url) {
    return true;
  }
  if (item.subs) {
    return item.subs.some((sub: MenuItem) =>
      _isActive(sub, activeUrl),
    );
  }
  return false;
}

function _hasRouteGroup(
  menu: MenuItem[],
  routeGroup: string,
): boolean {
  return menu.some((item) => _isRouteGroupInMenu(item, routeGroup));
}

function _isRouteGroupInMenu(
  item: MenuItem,
  routeGroup: string,
): boolean {
  if (routeGroup === item.key) {
    return true;
  }
  if (item.subs) {
    return item.subs.some((sub: MenuItem) =>
      _isRouteGroupInMenu(sub, routeGroup),
    );
  }
  return false;
}
