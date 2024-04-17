import Autocomplete from "@/components/common/Autocomplete";
import useTranslation from "@/hooks/useTranslation";
import { Department } from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import { useMemo } from "react";

const CateringSelector = ({
  style,
  cateringName,
  caterings,
  disabled,
  setCatering,
}: {
  disabled?: boolean;
  style?: React.CSSProperties;
  cateringName: string;
  caterings?: Department[];
  setCatering: (value?: string) => void;
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
    />
  );
};

export default CateringSelector;
