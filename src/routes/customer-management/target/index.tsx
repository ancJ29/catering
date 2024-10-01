import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import { Customer, Target, updateCustomer } from "@/services/domain";
import useCustomerStore from "@/stores/customer.store";
import { Stack } from "@mantine/core";
import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { configs } from "./_configs";
import Filter from "./components/Filters";
import Header from "./components/Header";

const CustomerTargetManagement = () => {
  const t = useTranslation();
  const { customerId } = useParams();
  const { customers: customerById } = useCustomerStore();
  const [changed, setChanged] = useState(false);
  const [customer, setCustomer] = useState<Customer>();
  const [targets, setTargets] = useState<Target[]>([]);
  const [actives] = useState<Map<string, boolean>>(new Map());

  const load = useCallback(async () => {
    if (!customerId) {
      return;
    }
    setChanged(false);
    const customer = customerById.get(customerId);
    setCustomer(customer);
    setTargets(customer?.others.targets || []);
  }, [customerById, customerId]);
  useOnMounted(load);

  const setActive = useCallback(
    async (key: string, active: boolean) => {
      actives.set(key, active);
      setChanged(true);
    },
    [actives],
  );

  const dataGridConfigs = useMemo(
    () => configs(t, actives, setActive),
    [t, actives, setActive],
  );

  const dataLoader = useCallback(() => {
    return Array.from(targets.values());
  }, [targets]);

  const { data, names, page, reload, setPage } =
    useFilterData<Target>({
      dataLoader,
    });

  const save = useCallback(async () => {
    if (!targets || !customer) {
      return;
    }
    await updateCustomer({
      ...customer,
      others: {
        ...customer?.others,
        targets: targets.map((target) => ({
          ...target,
          enabled:
            actives.get(`${target.name}-${target.shift}`) ??
            target.enabled,
        })),
      },
    });
    load();
  }, [actives, customer, load, targets]);

  return (
    <Stack gap={10}>
      <Header customer={customer} changed={changed} save={save} />
      <Filter
        changed={changed}
        save={save}
        names={names}
        reload={reload}
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

export default CustomerTargetManagement;
