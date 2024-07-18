import Autocomplete from "@/components/common/Autocomplete";
import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import { Customer, Department, Target } from "@/services/domain";
import useAuthStore from "@/stores/auth.store";
import useCateringStore from "@/stores/catering.store";
import useCustomerStore from "@/stores/customer.store";
import { Payload } from "@/types";
import { lastElement, sortShifts, unique } from "@/utils";
import { Button, Flex } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import CateringSelector from "../CateringSelector";
import RadioGroup, { RadioGroupProps } from "./RadioGroup";

// prettier-ignore
export type CateringBarProps = RadioGroupProps & {
  customer?: Customer;
  targetName: string;
  cateringId?: string;
  enableShift?: boolean;
  onClear: () => void;
  onChangeCateringId: (cateringId?: string) => void;
  onCustomerChange: (customer?: Customer) => void;
  onClearTarget?: () => void;
  onTargetChange: (_: Target) => void;
};

const CateringBar = ({
  shift,
  customer,
  targetName,
  cateringId,
  enableShift,
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
  const { caterings, names: allCateringNames } = useCateringStore();
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
    return unique(data);
  }, [customer]);

  const shiftData = useMemo(() => {
    const data = customer?.others.targets?.filter(
      (e) => e.name === targetName,
    );
    const shifts = data?.flatMap((e) => e.shift) || [];
    return sortShifts(shifts);
  }, [customer?.others.targets, targetName]);

  const _onTargetChange = useCallback(
    (targetName: string | null) => {
      if (targetName && customer?.others.targets) {
        if (targetName === t("All")) {
          onClearTarget && onClearTarget();
          return;
        }
        const targets = customer.others.targets.filter(
          (el) => el.name === targetName,
        );
        if (targets.length > 0) {
          onTargetChange(targets[0]);
          onChangeShift?.(targets[0].shift);
        }
      }
    },
    [
      customer?.others.targets,
      onChangeShift,
      onClearTarget,
      onTargetChange,
      t,
    ],
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

  const setCatering = useCallback(
    (cateringId?: string) => {
      if (!cateringId) {
        setCateringName("");
        onChangeCateringId();
      } else {
        const catering = caterings.get(cateringId);
        catering && setCateringName(catering.name);
        onChangeCateringId(cateringId);
        const customerNames =
          customerNamesByCateringId.get(cateringId) || [];
        customerNames.length === 1 &&
          _selectCustomer(customerNames[0]);
      }
    },
    [
      caterings,
      customerNamesByCateringId,
      _selectCustomer,
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
    if (caterings.size === 1) {
      const catering = lastElement(Array.from(caterings.values()));
      setCatering(catering.id);
      return;
    }
  }, [caterings, setCatering]);

  useEffect(() => {
    if (customerData.length === 1) {
      _selectCustomer(customerData[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex gap={10} justify="start" align="end">
      {!isCatering && (
        <CateringSelector
          cateringName={cateringName}
          disabled={cateringNames.length < 2}
          setCatering={setCatering}
        />
      )}
      {(!isCatering || customerData.length > 1) && (
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
      {Boolean(customer) && (
        <Select
          value={targetName || targetData[0]}
          label={t("Customer target")}
          data={targetData}
          onChange={_onTargetChange}
        />
      )}
      {enableShift && (
        <RadioGroup
          shifts={shiftData}
          shift={shift || ""}
          onChangeShift={onChangeShift}
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
