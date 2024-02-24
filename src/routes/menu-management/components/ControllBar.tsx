import Autocomplete from "@/components/common/Autocomplete";
import useTranslation from "@/hooks/useTranslation";
import { Customer } from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import useCustomerStore from "@/stores/customer.store";
import { Button, Flex, Select } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import DateControll, { DateControllProps } from "./DateControll";
import RadioGroup, { RadioGroupProps } from "./RadioGroup";

// prettier-ignore
type ControlBarProps = RadioGroupProps & Omit<DateControllProps, "onShift"> & {
  customer?: Customer;
  targetName: string;
  cateringId?: string;
  onClear: () => void;
  onChangeCateringId: (cateringId?: string) => void;
  onShiftMarkDate: (diff: 1 | -1) => void;
  onCustomerChange: (customer?: Customer) => void;
  onTargetChange: (_: {
    name: string;
    shifts: string[];
  }) => void;
};

const ControllBar = ({
  mode,
  shift,
  shifts,
  customer,
  targetName,
  cateringId,
  setShift,
  onShiftMarkDate,
  onClear,
  onChangeMode,
  onChangeCateringId,
  onTargetChange,
  onCustomerChange,
}: ControlBarProps) => {
  const t = useTranslation();
  const [cateringName, setCateringName] = useState("");
  const { idByName: customerIdByName, customers } =
    useCustomerStore();
  const {
    names: cateringNames,
    cateringIdByName,
    caterings,
  } = useCateringStore();

  const customerNamesByCateringId = useMemo(() => {
    const map = new Map<string, string[]>();
    Array.from(customers.values()).forEach((c) => {
      const list = map.get(c.others.cateringId) || [];
      list.push(c.name);
      map.set(c.others.cateringId, list);
    });
    return map;
  }, [customers]);

  const customerData = useMemo(() => {
    if (cateringId) {
      return customerNamesByCateringId.get(cateringId) || [];
    }
    return Array.from(customerIdByName.keys());
  }, [cateringId, customerIdByName, customerNamesByCateringId]);

  const targetData: string[] = useMemo(() => {
    return customer?.others.targets.map((el) => el.name) || [];
  }, [customer]);

  const _onTargetChange = useCallback(
    (targetName: string | null) => {
      if (targetName && customer?.others.targets) {
        const target = customer.others.targets.find(
          (el) => el.name === targetName,
        );
        target && onTargetChange(target);
      }
    },
    [customer, onTargetChange],
  );

  const _selectCustomer = useCallback(
    (name: string | null, updateOnEmpty = false) => {
      if (!name) {
        updateOnEmpty && onCustomerChange();
        return;
      }
      const customer = customers.get(
        customerIdByName.get(name) || "",
      );
      customer && onCustomerChange(customer);
    },
    [customerIdByName, customers, onCustomerChange],
  );

  const _selectCatering = useCallback(
    (cateringName: string | null) => {
      if (!cateringName) {
        setCateringName("");
        onChangeCateringId();
        return;
      }
      const cateringId = cateringIdByName.get(cateringName);
      if (cateringId) {
        setCateringName(cateringName);
        onChangeCateringId(cateringId);
        const customerNames =
          customerNamesByCateringId.get(cateringId) || [];
        customerNames.length === 1 &&
          _selectCustomer(customerNames[0]);
      }
    },
    [
      _selectCustomer,
      cateringIdByName,
      customerNamesByCateringId,
      onChangeCateringId,
    ],
  );

  useEffect(() => {
    if (cateringId) {
      const catering = caterings.get(cateringId);
      catering && setCateringName(catering.name);
    }
  }, [cateringId, caterings]);

  return (
    <Flex gap={10} w="100%" justify="space-between" align="end">
      <Flex gap={10} justify="start" align="end">
        <Autocomplete
          key={cateringName || "cateringName"}
          label={t("Catering name")}
          defaultValue={cateringName}
          data={cateringNames}
          disabled={cateringNames.length < 2}
          onChange={(value) => _selectCatering(value)}
        />
        <Autocomplete
          key={customer?.name || "customerName"}
          defaultValue={customer?.name || ""}
          label={t("Customer")}
          data={customerData}
          disabled={customerData.length < 2}
          onChange={_selectCustomer}
          onEnter={(value) => _selectCustomer(value, true)}
          onClear={() => _selectCustomer(null, true)}
        />
        {customer ? (
          <Select
            value={targetName}
            label={t("Customer target")}
            data={targetData}
            onChange={_onTargetChange}
          />
        ) : (
          ""
        )}
        {mode === "M" && shifts.length && (
          <RadioGroup
            shifts={shifts}
            shift={shift || ""}
            setShift={setShift}
          />
        )}
        <Button
          onClick={() => {
            setCateringName("");
            onClear();
          }}
        >
          {t("Clear")}
        </Button>
      </Flex>
      <DateControll
        mode={mode}
        onShift={onShiftMarkDate}
        onChangeMode={onChangeMode}
      />
    </Flex>
  );
};

export default ControllBar;
