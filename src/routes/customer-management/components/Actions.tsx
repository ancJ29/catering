import ActionIcon from "@/components/c-catering/ActionIcon";
import useTranslation from "@/hooks/useTranslation";
import { Customer } from "@/services/domain";
import { Flex } from "@mantine/core";
import {
  IconToolsKitchen,
  IconUsersGroup,
} from "@tabler/icons-react";

type ActionsProps = {
  customer: Customer;
  onTargetAudienceClick: (id: string) => void;
  onProductClick: (id: string) => void;
};

const Actions = ({
  customer,
  onTargetAudienceClick,
  onProductClick,
}: ActionsProps) => {
  const t = useTranslation();

  const actions = [
    {
      label: t("Meal target audience"),
      icon: <IconUsersGroup strokeWidth="1.5" />,
      onClick: () => onTargetAudienceClick(customer.id),
    },
    {
      label: t("Dish"),
      icon: <IconToolsKitchen strokeWidth="1.5" />,
      onClick: () => onProductClick(customer.id),
    },
  ];

  return (
    <Flex gap={10} justify="center">
      {actions.map(({ label, icon, onClick }, index) => (
        <ActionIcon key={index} label={label} onClick={onClick}>
          {icon}
        </ActionIcon>
      ))}
    </Flex>
  );
};

export default Actions;
