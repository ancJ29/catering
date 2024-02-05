import { useDisclosure } from "@mantine/hooks";
import { useCallback, useState } from "react";

export default function useToggleEditModal<T>() {
  const [opened, { open, close }] = useDisclosure(false);
  const [record, setData] = useState<T | undefined>();

  const toggleEditModal = useCallback(
    (record: T) => {
      setData(record);
      open();
    },
    [open],
  );

  return {
    record,
    opened,
    open,
    close,
    toggleEditModal,
  };
}
