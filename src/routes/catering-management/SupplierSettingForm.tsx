import useTranslation from "@/hooks/useTranslation";
import { Box, Modal, UnstyledButton } from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";
import { useMemo } from "react";

const SupplierSettingForm = ({
  totalSupplier,
  department: { name, code },
}: {
  department: {
    id: string;
    name: string;
    code: string;
    enabled: boolean;
  };
  totalSupplier: number;
}) => {
  const t = useTranslation();
  const [opened, { open, close }] = useDisclosure(false);
  const title = useMemo(
    () => `${t("Supplier Settings")} - ${name} (${code})`,
    [t, name, code],
  );

  return (
    <div>
      <UnstyledButton onClick={open}>
        {totalSupplier || "-"}
      </UnstyledButton>
      <Modal
        opened={opened}
        onClose={close}
        title={title}
        centered
        size="lg"
        classNames={{ title: "c-catering-font-bold" }}
      >
        <Box h={"50dvh"}>TODO</Box>
      </Modal>
    </div>
  );
};

export default SupplierSettingForm;
