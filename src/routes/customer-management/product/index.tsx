import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import {
  Customer,
  CustomerProduct,
  getCustomerProductsByCustomerId,
  updateCustomerProduct,
} from "@/services/domain";
import useCustomerStore from "@/stores/customer.store";
import useProductStore from "@/stores/product.store";
import { Stack } from "@mantine/core";
import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { configs } from "./_configs";
import Filter from "./components/Filter";
import Header from "./components/Header";

const CustomerProductManagement = () => {
  const t = useTranslation();
  const { customerId } = useParams();
  const { products: productById } = useProductStore();
  const { customers: customerById } = useCustomerStore();
  const [changed, setChanged] = useState(false);
  const [customer, setCustomer] = useState<Customer>();
  const [products, setProducts] = useState<CustomerProduct[]>([]);
  const [actives] = useState<Map<string, boolean>>(new Map());

  const load = useCallback(async () => {
    if (!customerId) {
      return;
    }
    setChanged(false);
    setCustomer(customerById.get(customerId));
    const customerProducts = await getCustomerProductsByCustomerId(
      customerId,
    );
    setProducts(customerProducts);
  }, [customerById, customerId]);
  useOnMounted(load);

  const setActive = useCallback(
    async (customerProductId: string, active: boolean) => {
      actives.set(customerProductId, active);
      setChanged(true);
    },
    [actives],
  );

  const dataGridConfigs = useMemo(
    () => configs(t, productById, actives, setActive),
    [t, productById, actives, setActive],
  );

  const dataLoader = useCallback(() => {
    return Array.from(products.values());
  }, [products]);

  const { data, names, page, reload, setPage } =
    useFilterData<CustomerProduct>({
      dataLoader,
    });

  const save = useCallback(async () => {
    if (!products) {
      return;
    }
    await updateCustomerProduct(
      products.map((p) => ({
        ...p,
        customerId: customerId || "",
        enabled: actives.get(p.id) ?? p.enabled,
      })),
    );
  }, [actives, customerId, products]);

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

export default CustomerProductManagement;
