import useTranslation from "@/hooks/useTranslation";
import { Image, Tooltip } from "@mantine/core";

type IconProps = {
  label: string;
  icon?: string;
  url?: string;
  disabled?: boolean;
};

const Icon = ({ disabled, label, icon }: IconProps) => {
  const t = useTranslation();
  return (
    <Tooltip
      disabled={disabled}
      label={t(label)}
      color="white"
      c="black"
      classNames={{ tooltip: "c-catering-bdr-f" }}
    >
      <Image
        radius="md"
        h={20}
        w={20}
        src={`/img/menu/${icon}.svg`}
      />
    </Tooltip>
  );
};
export default Icon;
