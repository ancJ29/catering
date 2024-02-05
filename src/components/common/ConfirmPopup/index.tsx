import useTranslation from "@/hooks/useTranslation";
import { Button, Text } from "@mantine/core";
import { modals } from "@mantine/modals";

type ConfirmPopupProps = {
  title: string;
  message: string;
  label: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

const ConfirmPopup = ({
  title,
  message,
  label,
  onConfirm,
  onCancel,
}: ConfirmPopupProps) => {
  const t = useTranslation();
  const openModal = () =>
    modals.openConfirmModal({
      title: title,
      children: <Text size="sm">{message}</Text>,
      labels: { confirm: "OK", cancel: t("Cancel") },
      onCancel: onCancel,
      onConfirm: onConfirm,
    });
  return <Button onClick={openModal}>{label}</Button>;
};

export default ConfirmPopup;
