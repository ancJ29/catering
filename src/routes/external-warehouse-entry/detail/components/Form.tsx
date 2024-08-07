import Autocomplete from "@/components/common/Autocomplete";
import DateTimeInput from "@/components/common/DateTimeInput";
import RadioGroup from "@/components/common/RadioGroup";
import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import {
  deliveryTimeStatusAndServiceStatusOrderOptions,
  Supplier,
} from "@/services/domain";
import useSupplierStore from "@/stores/supplier.store";
import { OptionProps } from "@/types";
import { formatTime } from "@/utils";
import { Flex } from "@mantine/core";
import { useMemo, useSyncExternalStore } from "react";
import store from "../_item.store";

const Form = () => {
  const t = useTranslation();
  const { suppliers } = useSupplierStore();
  const { purchaseOrder, disabled } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
  );

  const _suppliers: OptionProps[] = useMemo(() => {
    return Array.from(suppliers.values()).map((s: Supplier) => ({
      label: s.name,
      value: s.id,
    }));
  }, [suppliers]);

  const [deliveryTimeStatusOptions, serviceStatusOptions] =
    useMemo(() => {
      return deliveryTimeStatusAndServiceStatusOrderOptions(t);
    }, [t]);

  return (
    <Flex direction="column" gap={10}>
      <Flex justify="end" align="end" gap={10}>
        <Autocomplete
          value={purchaseOrder?.code}
          label={t("Purchase order po code")}
          w="25vw"
          data={[purchaseOrder?.code || ""]}
          disabled={true}
        />
        <DateTimeInput
          label={t("Purchase order date")}
          date={purchaseOrder?.deliveryDate.getTime()}
          onChangeDate={() => null}
          minDate={new Date()}
          time={formatTime(purchaseOrder?.deliveryDate, "HH:mm")}
          onChangeTime={() => null}
          w="25vw"
          required
          disabled={true}
        />
        <Select
          value={purchaseOrder?.supplierId}
          label={t("Purchase order supplier")}
          w="25vw"
          options={_suppliers}
          disabled={true}
        />
      </Flex>
      <Flex justify="end" align="end" gap={10}>
        <RadioGroup
          value={purchaseOrder?.others.deliveryTimeStatus}
          label={t("Purchase order delivery time")}
          options={deliveryTimeStatusOptions}
          disabled={disabled}
          onChange={store.setDeliveryTimeStatus}
          w="25vw"
        />
        <RadioGroup
          value={purchaseOrder?.others.serviceStatus}
          label={t("Purchase order service attitude")}
          options={serviceStatusOptions}
          disabled={disabled}
          onChange={store.setServiceStatus}
          w="20vw"
        />
      </Flex>
    </Flex>
  );
};

export default Form;
