import loadingStore from "@/services/api/store/loading";
import { Button, ButtonProps } from "@mantine/core";
import { useCallback } from "react";

interface CustomButtonProps extends ButtonProps {
  loading?: boolean;
  delay?: number;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const CustomButton = ({
  children,
  loading,
  delay,
  onClick,
  ...props
}: CustomButtonProps) => {
  const click = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (loading) {
        loadingStore.toggleLoading(delay || 200);
      }
      onClick?.(e);
    },
    [delay, loading, onClick],
  );
  return (
    <Button onClick={click} {...props}>
      {children}
    </Button>
  );
};

export default CustomButton;
