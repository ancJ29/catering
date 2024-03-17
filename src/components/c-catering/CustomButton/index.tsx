import useTranslation from "@/hooks/useTranslation";
import loadingStore from "@/services/api/store/loading";
import { Button, ButtonProps, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useCallback } from "react";

interface CustomButtonProps extends ButtonProps {
  loading?: boolean;
  delay?: number;
  confirm?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const CustomButton = ({
  children,
  loading,
  delay,
  confirm = false,
  onClick,
  ...props
}: CustomButtonProps) => {
  const t = useTranslation();
  const click = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!onClick) {
        return;
      }
      if (loading) {
        loadingStore.toggleLoading(delay || 200);
      }
      if (confirm) {
        modals.openConfirmModal({
          title: t("Save changes"),
          children: (
            <Text size="sm">
              {t("Are you sure to save changes?")}
            </Text>
          ),
          labels: { confirm: "OK", cancel: t("Cancel") },
          onConfirm: () => onClick?.(e),
        });
      } else {
        onClick(e);
      }
    },
    [delay, loading, confirm, onClick, t],
  );
  return (
    <Button onClick={click} {...props}>
      {children}
    </Button>
  );
};

export default CustomButton;
