import Autocomplete from "@/components/common/Autocomplete";
import useTranslation from "@/hooks/useTranslation";
import { Customer, Department } from "@/services/domain";
import useAuthStore from "@/stores/auth.store";
import useCateringStore from "@/stores/catering.store";
import useCustomerStore from "@/stores/customer.store";
import { Payload } from "@/types";
import { Button, Flex, Select } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import RadioGroup, { RadioGroupProps } from "./RadioGroup";

// prettier-ignore
export type CateringBarProps = RadioGroupProps & {
  customer?: Customer;
  targetName: string;
  cateringId?: string;
  allowAllTarget?: boolean;
  enableShift?: boolean;
  onClear: () => void;
  onChangeCateringId: (cateringId?: string) => void;
  onCustomerChange: (customer?: Customer) => void;
  onClearTarget?: () => void;
  onTargetChange: (_: {
    name: string;
    shifts: string[];
  }) => void;
};

const CateringBar = ({
  shift,
  shifts,
  customer,
  targetName,
  cateringId,
  enableShift,
  allowAllTarget,
  onChangeShift,
  onClear,
  onChangeCateringId,
  onClearTarget,
  onTargetChange,
  onCustomerChange,
}: CateringBarProps) => {
  const t = useTranslation();
  const { user, isCatering } = useAuthStore();
  const { idByName: customerIdByName, customers } =
    useCustomerStore();
  const {
    cateringIdByName,
    caterings,
    names: allCateringNames,
  } = useCateringStore();
  const [cateringName, setCateringName] = useState("");

  const [cateringIds, cateringNames] = useMemo(() => {
    if (!isCatering) {
      return [Array.from(caterings.keys()), allCateringNames];
    }
    const arr = Array.from(caterings.values());
    const ids = _cateringIds(arr, isCatering, user || undefined);
    const names = arr
      .filter((c) => ids.includes(c.id))
      .map((c) => c.name);
    return [ids, names];
  }, [isCatering, caterings, user, allCateringNames]);

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
    if (!customers.size) {
      return [];
    }
    if (isCatering) {
      const cateringId = user?.departmentIds?.[0];
      return Array.from(customers.values())
        .filter((c) => c.others.cateringId === cateringId)
        .map((c) => c.name);
    }
    if (cateringId) {
      return customerNamesByCateringId.get(cateringId) || [];
    }
    return Array.from(customers.values())
      .filter((c) => cateringIds.includes(c.others.cateringId))
      .map((c) => c.name);
  }, [
    customers,
    isCatering,
    cateringId,
    user,
    customerNamesByCateringId,
    cateringIds,
  ]);

  const targetData: string[] = useMemo(() => {
    const data = customer?.others.targets.map((el) => el.name) || [];
    if (allowAllTarget && data.length > 1) {
      data.unshift(t("All"));
    }
    return data;
  }, [allowAllTarget, customer, t]);

  const _onTargetChange = useCallback(
    (targetName: string | null) => {
      if (targetName && customer?.others.targets) {
        if (targetName === t("All")) {
          onClearTarget && onClearTarget();
          return;
        }
        const target = customer.others.targets.find(
          (el) => el.name === targetName,
        );
        target && onTargetChange(target);
      }
    },
    [customer, onClearTarget, onTargetChange, t],
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

  useEffect(() => {
    if (cateringNames.length === 1) {
      if (cateringNames[0] !== cateringName) {
        _selectCatering(cateringNames[0]);
      }
      return;
    }
    if (customerData.length === 1) {
      if (customerData[0] !== customer?.name) {
        _selectCustomer(customerData[0]);
      }
      return;
    }
  }, [
    _selectCatering,
    _selectCustomer,
    cateringName,
    cateringNames,
    customer?.name,
    customerData,
  ]);

  return (
    <Flex gap={10} justify="start" align="end">
      {isCatering ? (
        ""
      ) : (
        <Autocomplete
          key={cateringName || "cateringName"}
          label={t("Catering name")}
          defaultValue={cateringName}
          data={cateringNames}
          disabled={cateringNames.length < 2}
          onChange={(value) => _selectCatering(value)}
        />
      )}
      {isCatering && customerData.length < 2 ? (
        ""
      ) : (
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
      )}
      {customer ? (
        <Select
          value={targetName || t("All")}
          label={t("Customer target")}
          data={targetData}
          onChange={_onTargetChange}
        />
      ) : (
        ""
      )}
      {enableShift && shifts?.length ? (
        <RadioGroup
          shifts={shifts}
          shift={shift || ""}
          onChangeShift={onChangeShift}
        />
      ) : (
        ""
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
  );
};

export default CateringBar;

function _cateringIds(
  caterings: Department[],
  isCatering: boolean,
  user?: Payload,
): string[] {
  if (!user) {
    return [];
  }
  return caterings
    .filter((c) => {
      if (isCatering) {
        return user.departmentIds?.includes(c.id);
      }
      return true;
    })
    .map((c) => c.id);
}
