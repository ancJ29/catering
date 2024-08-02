import { poCateringStatusSchema } from "@/auto-generated/api-configs";
import Autocomplete from "@/components/common/Autocomplete";
import DateInput from "@/components/common/DateInput";
import RadioGroup from "@/components/common/RadioGroup";
import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import {
  deliveryTimeStatusAndServiceStatusOrderOptions,
  Supplier,
  xStatusOrderCateringOptions,
} from "@/services/domain";
import useSupplierStore from "@/stores/supplier.store";
import { OptionProps } from "@/types";
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

  const [statusOptions] = useMemo(() => {
    return xStatusOrderCateringOptions(t);
  }, [t]);

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
        <DateInput
          label={t("Purchase order date")}
          value={purchaseOrder?.deliveryDate}
          onChangeDate={() => null}
          w="25vw"
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
      <Flex justify="space-between" align="end" gap={10}>
        <RadioGroup
          value={
            purchaseOrder?.others.status ===
            poCateringStatusSchema.Values.CNK
              ? poCateringStatusSchema.Values.CN
              : purchaseOrder?.others.status
          }
          label={t("Status")}
          options={statusOptions}
          disabled={disabled}
          w="30vw"
          onChange={store.setStatus}
        />
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
          w="25vw"
        />
      </Flex>
    </Flex>
  );
};

export default Form;
