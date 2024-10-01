import { stopMouseEvent } from "@/utils";
import {
  ActionIcon as MantineActionIcon,
  ActionIconProps as MantineActionIconProps,
  Tooltip,
} from "@mantine/core";

interface ActionIconProps extends MantineActionIconProps {
  label?: string;
  onClick: () => void;
}

const ActionIcon = ({
  label,
  onClick,
  ...props
}: ActionIconProps) => {
  const handleClick = (e: React.MouseEvent) => {
    stopMouseEvent(e);
    onClick();
  };

  const iconElement = (
    <MantineActionIcon
      variant="outline"
      onClick={handleClick}
      {...props}
    />
  );

  return label ? (
    <Tooltip label={label}>{iconElement}</Tooltip>
  ) : (
    iconElement
  );
};

export default ActionIcon;
