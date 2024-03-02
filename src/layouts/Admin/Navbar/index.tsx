import useTranslation from "@/hooks/useTranslation";
import { Menu } from "@/types";
import { Box, NavLink } from "@mantine/core";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Icon from "./Icon";
import classes from "./navbar.module.scss";

type NavbarProps = {
  opened?: boolean;
  menu: Menu;
  level?: number;
  onOpenNavbar?: () => void;
};
const Navbar = ({
  level = 1,
  opened,
  menu,
  onOpenNavbar,
}: NavbarProps) => {
  const t = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);
  const [activeKey, setActiveKey] = useState("");

  useEffect(() => {
    setActive(location.pathname);
    setActiveKey("");
  }, [location.pathname]);

  const open = useCallback(
    (item: { key: string; url?: string; subs?: unknown[] }) => {
      if (item.subs) {
        setActiveKey((prev) => (prev === item.key ? "" : item.key));
        return;
      }
      if (!item.url) {
        alert("Not implemented!!!");
        return;
      }
      navigate(item.url);
    },
    [navigate],
  );

  return menu.length ? (
    <Box
      className={classes.wrapper}
      pb={level === 1 ? "2rem" : "0"}
      onClick={onOpenNavbar}
    >
      {menu.map((item, idx) => (
        <NavLink
          opened={item.subs && activeKey === item.key}
          key={idx}
          h="3rem"
          onClick={open.bind(null, item)}
          label={opened ? t(item.label) : ""}
          classNames={{
            children: "c-catering-p-0",
          }}
          className={clsx(
            classes.item,
            active === item.url ? classes.active : "",
          )}
          leftSection={<Icon {...item} disabled={opened} />}
        >
          {item.subs && opened && (
            <Navbar opened level={level + 1} menu={item.subs || []} />
          )}
        </NavLink>
      ))}
    </Box>
  ) : (
    ""
  );
};
export default Navbar;
