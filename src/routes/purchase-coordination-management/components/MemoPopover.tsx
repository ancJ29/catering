import useTranslation from "@/hooks/useTranslation";
import { User } from "@/routes/user-management/_configs";
import { PurchaseCoordination } from "@/services/domain";
import { formatTime } from "@/utils";
import { Flex, Popover, Text, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconInfoCircle } from "@tabler/icons-react";

type MemoPopoverProps = {
  purchaseCoordination: PurchaseCoordination;
  users: Map<string, User>;
};

const fz = 14;

const MemoPopover = ({
  purchaseCoordination,
  users,
}: MemoPopoverProps) => {
  const t = useTranslation();
  const [opened, { close, open }] = useDisclosure(false);

  const CustomText = ({
    title,
    content,
  }: {
    title: string;
    content?: string;
  }) => {
    return (
      <Flex direction="row" gap={5}>
        <Text fz={fz} fw={600}>
          {title}:{" "}
        </Text>
        <Text fz={fz}>{content}</Text>
      </Flex>
    );
  };

  return (
    <Popover
      width={300}
      position="left"
      withArrow
      shadow="md"
      opened={opened}
    >
      <Popover.Target>
        <UnstyledButton
          onMouseEnter={open}
          onMouseLeave={close}
          display="flex"
        >
          <IconInfoCircle strokeWidth="1.5" color="black" />
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown style={{ pointerEvents: "none" }}>
        <Text fz={fz} fw={600}>
          {t("Other information")}
        </Text>
        <CustomText
          title={t("Create by")}
          content={
            users.get(purchaseCoordination.others.createdById)
              ?.fullName
          }
        />
        <CustomText
          title={t("Create at")}
          content={formatTime(
            purchaseCoordination.others.createAt,
            "DD/MM/YYYY HH:mm",
          )}
        />
        <CustomText
          title={t("Approved by")}
          content={
            users.get(purchaseCoordination.others.approvedById)
              ?.fullName
          }
        />
        <CustomText
          title={t("Approved at")}
          content={formatTime(
            purchaseCoordination.others.approvedAt,
            "DD/MM/YYYY HH:mm",
          )}
        />
      </Popover.Dropdown>
    </Popover>
  );
};

export default MemoPopover;
