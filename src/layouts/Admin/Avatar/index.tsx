import { Payload } from "@/types";
import { getInitials } from "@/utils";
import { Flex, Avatar as MantineAvatar } from "@mantine/core";
import { NavLink } from "react-router-dom";

type AvatarProps = {
  user?: Payload | null;
};

const Avatar = ({ user }: AvatarProps) => {
  return (
    <Flex visibleFrom="xs">
      <NavLink className="c-catering-text-main" to="/profile">
        <MantineAvatar color="primary" radius="xl">
          {getInitials(user?.fullName || "")}
        </MantineAvatar>
      </NavLink>
    </Flex>
  );
};

export default Avatar;
