import { stopMouseEvent } from "@/utils";
import { Badge, Flex, Text } from "@mantine/core";
import { IconTruck } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const IconBadge = ({
  total,
  navigateUrl,
  onClick,
}: {
  total: number;
  navigateUrl?: string;
  onClick?: () => void;
}) => {
  const navigate = useNavigate();
  return (
    <Badge
      color={total > 0 ? "orange.6" : "gray"}
      p={10}
      onClick={(e) => {
        stopMouseEvent(e);
        navigateUrl ? navigate(navigateUrl) : onClick?.();
      }}
    >
      <Flex align="center" p={4}>
        <IconTruck size={20} />
        &nbsp;
        <Text fw={800} fz="1rem">
          ({total})
        </Text>
      </Flex>
    </Badge>
  );
};

export default IconBadge;
