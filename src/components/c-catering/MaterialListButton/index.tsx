import useTranslation from "@/hooks/useTranslation";
import { Button, ButtonProps } from "@mantine/core";
import {
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";
import { CSSProperties } from "react";

interface MaterialListButtonProps extends ButtonProps {
  opened: boolean;
  onClick: () => void;
  title?: string;
  style?: CSSProperties;
}

const MaterialListButton = ({
  opened,
  onClick,
  title,
  style,
  ...props
}: MaterialListButtonProps) => {
  const t = useTranslation();
  return (
    <Button
      onClick={onClick}
      style={style}
      leftSection={opened ? null : <IconChevronsLeft size={16} />}
      rightSection={opened ? <IconChevronsRight size={16} /> : null}
      variant="transparent"
      {...props}
    >
      {title ?? t("Material list")}
    </Button>
  );
};

export default MaterialListButton;
