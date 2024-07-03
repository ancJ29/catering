import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import { Customer } from "@/services/domain";
import {
  CustomerProduct,
  getAllCustomerProducts,
  updateCustomerProduct,
} from "@/services/domain/customer-product";
import useCustomerStore from "@/stores/customer.store";
import useProductStore from "@/stores/product.store";
import { Button, Flex, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
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
    const customerProducts = await getAllCustomerProducts(customerId);
    setProducts(customerProducts);
  }, [customerById, customerId]);
  useOnMounted(load);

  const setActive = useCallback(
    async (CustomerProductId: string, active: boolean) => {
      actives.set(CustomerProductId, active);
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

  const save = useCallback(() => {
    modals.openConfirmModal({
      title: t("Update changes"),
      children: (
        <Text size="sm">{t("Are you sure to save changes?")}</Text>
      ),
      labels: { confirm: "OK", cancel: t("Cancel") },
      onConfirm: async () => {
        if (!products) {
          return;
        }
        await updateCustomerProduct(
          products.map((p) => ({
            id: p.id,
            productId: p.productId,
            customerId: customerId || "",
            enabled: actives.get(p.id) ?? p.enabled,
          })),
        );
        load();
      },
    });
  }, [actives, customerId, load, products, t]);

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

export default CustomerProductManagement;
