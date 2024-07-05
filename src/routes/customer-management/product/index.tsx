import CustomButton from "@/components/c-catering/CustomButton";
import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import { Customer } from "@/services/domain";
import {
  CustomerProduct,
  getCustomerProductsByCustomerId,
  updateCustomerProduct,
} from "@/services/domain/customer-product";
import useCustomerStore from "@/stores/customer.store";
import useProductStore from "@/stores/product.store";
import { Flex, Stack, Text } from "@mantine/core";
import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FilterType,
  configs,
  defaultCondition,
  filter,
} from "./_config";
import Filter from "./components/Filter";

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

  const {
    condition,
    data,
    names,
    page,
    reload,
    setPage,
    updateCondition,
  } = useFilterData<CustomerProduct, FilterType>({
    dataLoader,
    filter,
    defaultCondition,
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

export default CustomerProductManagement;
