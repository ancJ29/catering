import useTranslation from "@/hooks/useTranslation";
import { Image, Tooltip } from "@mantine/core";

type IconProps = {
  label: string;
  icon?: string;
  url?: string;
  disabled?: boolean;
  onClick?: () => void;
};

const Icon = ({ disabled, label, icon, onClick }: IconProps) => {
  const t = useTranslation();
  return (
    <Tooltip
      disabled={disabled}
      label={t(label)}
      color="#fff"
      c="black"
      classNames={{ tooltip: "c-catering-bdr-f" }}
    >
      <Image
        onClick={disabled ? undefined : onClick}
        radius="md"
        h={20}
        w={20}
        src={`/img/menu/${icon}.svg`}
      />
    </Tooltip>
  );
};
export default Icon;
