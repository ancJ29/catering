import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import {
  Customer,
  getServiceByCustomerId,
  Service,
  updateService,
} from "@/services/domain";
import useCustomerStore from "@/stores/customer.store";
import { Button, Flex, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  configs,
  defaultCondition,
  filter,
  FilterType,
} from "./_config";
import Filter from "./components/Filter";

const CustomerServiceManagement = () => {
  const t = useTranslation();
  const { customerId } = useParams();
  const { customers: customerById } = useCustomerStore();
  const [changed, setChanged] = useState(false);
  const [customer, setCustomer] = useState<Customer>();
  const [services, setServices] = useState<Service[]>([]);
  const [actives] = useState<Map<string, boolean>>(new Map());

  const load = useCallback(async () => {
    if (!customerId) {
      return;
    }
    setChanged(false);
    setCustomer(customerById.get(customerId));
    const services = await getServiceByCustomerId(customerId);
    setServices(services);
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
    return Array.from(services.values());
  }, [services]);

  const {
    condition,
    data,
    names,
    page,
    reload,
    setPage,
    updateCondition,
  } = useFilterData<Service, FilterType>({
    dataLoader,
    filter,
    defaultCondition,
  });

  const save = useCallback(() => {
    modals.openConfirmModal({
      title: t("Update changes"),
      children: (
        <Text size="sm">{t("Are you sure to save changes?")}</Text>
      ),
      labels: { confirm: "OK", cancel: t("Cancel") },
      onConfirm: async () => {
        if (!services) {
          return;
        }
        await updateService(
          services.map((s) => ({
            ...s,
            customerId: customerId || "",
            enabled: actives.get(s.id) ?? s.enabled,
          })),
        );
        load();
      },
    });
  }, [actives, customerId, load, services, t]);

  return (
    <Stack gap={10}>
      <Flex w="100%" align="center" justify="space-between">
        <Text className="c-catering-font-bold" size="2rem">
          {customer?.name || "-"} - {t("Product")}
        </Text>
        <Button disabled={!changed} onClick={save}>
          {t("Save")}
        </Button>
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

export default CustomerServiceManagement;
