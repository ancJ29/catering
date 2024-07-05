import CustomButton from "@/components/c-catering/CustomButton";
import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import {
  Customer,
  getMealByCustomerId,
  Meal,
  updateMeal,
} from "@/services/domain";
import useCustomerStore from "@/stores/customer.store";
import { Flex, Stack, Text } from "@mantine/core";
import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  configs,
  defaultCondition,
  filter,
  FilterType,
} from "./_config";
import Filter from "./components/Filter";

const CustomerMealManagement = () => {
  const t = useTranslation();
  const { customerId } = useParams();
  const { customers: customerById } = useCustomerStore();
  const [changed, setChanged] = useState(false);
  const [customer, setCustomer] = useState<Customer>();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [actives] = useState<Map<string, boolean>>(new Map());

  const load = useCallback(async () => {
    if (!customerId) {
      return;
    }
    setChanged(false);
    setCustomer(customerById.get(customerId));
    const services = await getMealByCustomerId(customerId);
    setMeals(services);
  }, [customerById, customerId]);
  useOnMounted(load);

  const setActive = useCallback(
    async (serviceId: string, active: boolean) => {
      actives.set(serviceId, active);
      setChanged(true);
    },
    [actives],
  );

  const dataGridConfigs = useMemo(
    () => configs(t, actives, setActive),
    [t, actives, setActive],
  );

  const dataLoader = useCallback(() => {
    return Array.from(meals.values());
  }, [meals]);

  const {
    condition,
    data,
    names,
    page,
    reload,
    setPage,
    updateCondition,
  } = useFilterData<Meal, FilterType>({
    dataLoader,
    filter,
    defaultCondition,
  });

  const save = useCallback(async () => {
    if (!meals) {
      return;
    }
    await updateMeal(
      meals.map((s) => ({
        ...s,
        customerId: customerId || "",
        enabled: actives.get(s.id) ?? s.enabled,
      })),
    );
    load();
  }, [actives, customerId, load, meals]);

  return (
    <Stack gap={10}>
      <Flex w="100%" align="center" justify="space-between">
        <Text className="c-catering-font-bold" size="2rem">
          {customer?.name || "-"} - {t("Product")}
        </Text>
        <CustomButton disabled={!changed} onClick={save} confirm>
          {t("Save")}
        </CustomButton>
      </Flex>
      <Filter
        names={names}
        reload={reload}
        served={condition?.served}
        onChangeServed={updateCondition.bind(null, "served", "")}
      />
      <DataGrid
        hasUpdateColumn={false}
        page={page}
        limit={10}
        isPaginated
        hasOrderColumn
        columns={dataGridConfigs}
        data={data}
        onChangePage={setPage}
      />
    </Stack>
  );
};

export default CustomerMealManagement;
