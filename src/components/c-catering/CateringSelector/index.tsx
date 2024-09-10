import Autocomplete from "@/components/common/Autocomplete";
import useTranslation from "@/hooks/useTranslation";
import { Department } from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import { ResponsiveWidth } from "@/types";
import { useMemo } from "react";

const CateringSelector = ({
  style,
  cateringName,
  caterings,
  disabled,
  setCatering,
  w,
}: {
  disabled?: boolean;
  style?: React.CSSProperties;
  cateringName: string;
  caterings?: Department[];
  setCatering: (value?: string) => void;
  w?: ResponsiveWidth;
}) => {
  const t = useTranslation();

  const options = useMemo(() => {
    if (caterings) {
      return caterings.map((el) => ({
        label: el.name,
        value: el.id,
      }));
    }
    const data = useCateringStore.getState().caterings.values();
    return Array.from(data).map((el) => ({
      label: el.name,
      value: el.id,
    }));
  }, [caterings]);

  return (
    <Autocomplete
      style={style}
      disabled={disabled}
      key={cateringName}
      label={t("Catering name")}
      defaultValue={cateringName}
      options={options}
      onClear={setCatering}
      onEnter={setCatering}
      onChange={setCatering}
      w={w}
    />
  );
};

export default CateringSelector;
