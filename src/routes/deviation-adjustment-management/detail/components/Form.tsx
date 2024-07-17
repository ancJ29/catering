import DateTimeInput from "@/components/common/DateTimeInput";
import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import { Department, Supplier } from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import useSupplierStore from "@/stores/supplier.store";
import { OptionProps } from "@/types";
import { formatTime } from "@/utils";
import { Flex } from "@mantine/core";
import { useMemo, useSyncExternalStore } from "react";
import store from "../purchase-order.store";

const Form = () => {
  const t = useTranslation();
  const { purchaseOrder } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
  );
  const { activeCaterings } = useCateringStore();
  const { suppliers } = useSupplierStore();

  const _caterings: OptionProps[] = useMemo(() => {
    return Array.from(activeCaterings.values()).map(
      (d: Department) => ({
        label: d.name,
        value: d.id,
      }),
    );
  }, [activeCaterings]);

  const _suppliers: OptionProps[] = useMemo(() => {
    return Array.from(suppliers.values()).map((s: Supplier) => ({
      label: s.name,
      value: s.id,
    }));
  }, [suppliers]);

  return (
    <Flex justify="end" align="end" gap={10}>
      <Select
        value={purchaseOrder?.others.receivingCateringId}
        label={t("Purchase order catering")}
        w={"25vw"}
        options={_caterings}
        disabled={true}
      />
      <DateTimeInput
        label={t("Purchase request date")}
        date={purchaseOrder?.deliveryDate.getTime() || 0}
        onChangeDate={() => null}
        time={formatTime(purchaseOrder?.deliveryDate, "HH:mm")}
        onChangeTime={() => null}
        w={"25vw"}
        disabled={true}
      />
      <Select
        value={purchaseOrder?.supplierId}
        label={t("Purchase order supplier")}
        w={"25vw"}
        options={_suppliers}
        disabled={true}
      />
    </Flex>
  );
};

export default Form;
