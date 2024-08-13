import DataGrid from "@/components/common/DataGrid";
import DateInput from "@/components/common/DateInput";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import { DailyMenu } from "@/services/domain";
import useCustomerStore from "@/stores/customer.store";
import useMaterialStore from "@/stores/material.store";
import useProductStore from "@/stores/product.store";
import { Button, Flex, Grid } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useCallback, useMemo, useSyncExternalStore } from "react";
import store from "../../_export.store";
import {
  dailyMenuConfigs,
  materialConfigs,
  MenuItem,
  MenuMaterial,
} from "./_configs";

const Menu = () => {
  const t = useTranslation();
  const { products } = useProductStore();
  const { customers } = useCustomerStore();
  const { materials } = useMaterialStore();
  const {
    currentDailyMenus,
    dailyMenuDate,
    key,
    currentMenuMaterials,
  } = useSyncExternalStore(store.subscribe, store.getSnapshot);

  const dataGridConfigs = useMemo(
    () => dailyMenuConfigs(t, products, customers),
    [customers, products, t],
  );

  const dataLoader = useCallback(() => {
    return Array.from(Object.values(currentDailyMenus)).flatMap(
      (dailyMenu: DailyMenu) => {
        return Object.keys(dailyMenu.others.quantity).map(
          (productId) => {
            return {
              productId,
              quantity: dailyMenu.others.quantity[productId] || 0,
              shift: dailyMenu.others.shift || "",
              customerId: dailyMenu.customerId || "",
              targetName: dailyMenu.others.targetName || "",
              date: dailyMenu.date,
              name: "",
            };
          },
        );
      },
    );
  }, [currentDailyMenus]);

  const { data, page, setPage } = useFilterData<MenuItem>({
    dataLoader,
  });

  const materialDataGridConfigs = useMemo(
    () => materialConfigs(t, materials),
    [materials, t],
  );

  const materialDataLoader = useCallback(() => {
    return Array.from(Object.values(currentMenuMaterials));
  }, [currentMenuMaterials]);

  const {
    data: materialData,
    page: materialPage,
    setPage: setMaterialPage,
  } = useFilterData<MenuMaterial>({
    dataLoader: materialDataLoader,
  });

  const addToExportReceipt = () => {
    store.addMenuMaterialToExportReceipt();
    notifications.show({
      color: "green.5",
      message: t("Add successfully"),
    });
  };

  return (
    <Flex direction="column" gap={10}>
      <Flex gap={10} justify="end" align="end">
        <DateInput
          label={t("Meal date")}
          value={new Date(dailyMenuDate)}
          onChangeDate={store.setDailyMenuDate}
          w="20vw"
        />
      </Flex>
      <Flex justify="end" align="end">
        <Button onClick={addToExportReceipt}>
          {t("Add to export receipt")}
        </Button>
      </Flex>
      <Grid>
        <Grid.Col span={6}>
          <DataGrid
            key={key}
            page={page}
            limit={5}
            isPaginated
            hasOrderColumn
            hasUpdateColumn={false}
            columns={dataGridConfigs}
            data={data}
            onChangePage={setPage}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <DataGrid
            key={key}
            page={materialPage}
            limit={5}
            isPaginated
            hasOrderColumn
            hasUpdateColumn={false}
            columns={materialDataGridConfigs}
            data={materialData}
            onChangePage={setMaterialPage}
            noResultText=" "
          />
        </Grid.Col>
      </Grid>
    </Flex>
  );
};

export default Menu;
