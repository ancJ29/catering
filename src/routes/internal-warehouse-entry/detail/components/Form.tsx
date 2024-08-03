import DateTimeInput from "@/components/common/DateTimeInput";
import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import { Department } from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import { OptionProps } from "@/types";
import { formatTime } from "@/utils";
import { Flex } from "@mantine/core";
import { useMemo, useSyncExternalStore } from "react";
import store from "../_item.store";

const Form = () => {
  const t = useTranslation();
  const { activeCaterings } = useCateringStore();
  const { purchaseInternal } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
  );

  const _caterings: OptionProps[] = useMemo(() => {
    return Array.from(activeCaterings.values()).map(
      (p: Department) => ({
        label: p.name,
        value: p.id,
      }),
    );
  }, [activeCaterings]);

  return (
    <Flex justify="end" align="end" gap={10}>
      <DateTimeInput
        label={t("Purchase internal date")}
        date={purchaseInternal?.deliveryDate.getTime()}
        onChangeDate={() => null}
        time={formatTime(purchaseInternal?.deliveryDate, "HH:mm")}
        onChangeTime={() => null}
        w="25vw"
        disabled={true}
      />
      <Select
        value={purchaseInternal?.deliveryCateringId}
        label={t("Purchase internal delivery catering")}
        w="20vw"
        options={_caterings}
        onChange={() => null}
        disabled={true}
      />
    </Flex>
  );
};

export default Form;
