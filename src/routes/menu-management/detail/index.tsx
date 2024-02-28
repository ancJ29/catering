import { Actions } from "@/auto-generated/api-configs";
import AutocompleteForFilterData from "@/components/c-catering/AutocompleteForFilterData";
import Selector from "@/components/c-catering/Selector";
import DataGrid from "@/components/common/DataGrid";
import NumberInput from "@/components/common/NumberInput";
import Select from "@/components/common/Select";
import useFilterData from "@/hooks/useFilterData";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import callApi from "@/services/api";
import loadingStore from "@/services/api/store/loading";
import {
  DailyMenu,
  Product,
  blankDailyMenu,
  dailyMenuKey,
  getDailyMenu,
  productTypeOptions,
  type DailyMenuDetailMode as Mode,
} from "@/services/domain";
import logger from "@/services/logger";
import useAuthStore from "@/stores/auth.store";
import useCateringStore from "@/stores/catering.store";
import useCustomerStore from "@/stores/customer.store";
import useDailyMenuStore from "@/stores/daily-menu.store";
import useProductStore from "@/stores/product.store";
import { OptionProps } from "@/types";
import { ONE_DAY, isPastDate, randomString } from "@/utils";
import {
  Box,
  Button,
  Flex,
  Grid,
  ScrollArea,
  Text,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  useCallback,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import Steppers from "../components/Steppers";
import TabControll from "../components/TabControll";
import { _configs } from "./_config";
import { FilterType, defaultCondition, filter } from "./_filter";
import store from "./_item.store";
let _counter = 0;
const EditModal = () => {
  const params = useParams();
  const t = useTranslation();
  const navigate = useNavigate();
  const {
    allTypes,
    products: allProducts,
    reload: loadAllProducts,
  } = useProductStore();
  const { customers, reload: loadAllCustomers } = useCustomerStore();
  const { reload: loadAllCaterings } = useCateringStore();
  const { dailyMenu: records, push: pushDailyMenu } =
    useDailyMenuStore();
  const [dailyMenu, setDailyMenu] = useState<DailyMenu>();
  const {
    item: updatedDailyMenu,
    productIds,
    updated,
  } = useSyncExternalStore(store.subscribe, store.getSnapshot);

  const { timestamp, customerId, shift, targetName } = useMemo(() => {
    return {
      customerId: params.customerId || "",
      targetName: decodeURIComponent(params.targetName || ""),
      shift: decodeURIComponent(params.shift || ""),
      timestamp: parseInt(params.timestamp || "0"),
    };
  }, [params]);

  const save = useCallback(async () => {
    if (!updatedDailyMenu || !dailyMenu) {
      return;
    }
    const quantity = updatedDailyMenu.others.quantity;
    const date = dailyMenu.date;
    Object.keys(quantity).forEach((productId) => {
      if (quantity[productId] < 1) {
        delete quantity[productId];
      }
    });
    modals.openConfirmModal({
      title: `${t("Update menu")}`,
      children: (
        <Text size="sm">
          {t("Are you sure you want to save menu?")}
        </Text>
      ),
      labels: { confirm: "OK", cancel: t("Cancel") },
      onConfirm: async () => {
        loadingStore.startLoading();
        const { id } =
          (await callApi<unknown, { id: string }>({
            action: Actions.PUSH_DAILY_MENU,
            params: {
              date,
              targetName,
              shift,
              status: dailyMenu.others.status,
              customerId,
              quantity,
            },
          })) || {};
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const res = await getDailyMenu({
          id,
          noCache: true,
          customerId: dailyMenu.customerId,
          from: timestamp - ONE_DAY,
          to: timestamp + ONE_DAY,
        });
        if (res.length === 1) {
          pushDailyMenu(res);
          store.set(res[0]);
          setDailyMenu(res[0]);
        }
        loadingStore.stopLoading();
        navigate(-1);
      },
    });
  }, [
    updatedDailyMenu,
    dailyMenu,
    customerId,
    targetName,
    shift,
    timestamp,
    t,
    pushDailyMenu,
    navigate,
  ]);

  const _reload = useCallback(async () => {
    if (dailyMenu || !customerId || !targetName || !shift) {
      return;
    }
    loadAllProducts();
    loadAllCaterings();
    if (customers.size === 0) {
      loadAllCustomers();
      return;
    }
    const customer = customers.get(customerId);
    if (!customer) {
      return;
    }
    const target = customer?.others.targets.find(
      (t) => t.name === targetName,
    );
    if (!target?.shifts.includes(shift)) {
      return;
    }
    const key = dailyMenuKey(
      customerId,
      targetName,
      shift,
      timestamp,
    );
    const y = records.get(key);
    if (y) {
      store.set(y);
      setDailyMenu(y);
    } else {
      if (_counter > 10) {
        return;
      }
      logger.debug("getDailyMenu...", _counter);
      _counter++;
      const res = await getDailyMenu({
        customerId,
        from: timestamp - ONE_DAY,
        to: timestamp + ONE_DAY,
      });
      if (res.length) {
        res.length && pushDailyMenu(res);
      } else {
        const menu = blankDailyMenu(
          customer,
          targetName,
          shift,
          new Date(timestamp),
        );
        store.set(menu);
        setDailyMenu(menu);
      }
    }
  }, [
    dailyMenu,
    customerId,
    targetName,
    shift,
    customers,
    timestamp,
    records,
    loadAllProducts,
    loadAllCustomers,
    loadAllCaterings,
    pushDailyMenu,
  ]);

  useOnMounted(_reload);

  const disabled = useMemo(() => {
    return isPastDate(dailyMenu?.date);
  }, [dailyMenu]);
  const { isCatering, user } = useAuthStore();
  const [tab, setActiveTab] = useState<Mode>(
    isCatering ? "modified" : "detail",
  );

  const typeOptions: OptionProps[] = useMemo(
    () => productTypeOptions(allTypes, t),
    [allTypes, t],
  );

  const [key, configs] = useMemo(() => {
    if (user && dailyMenu) {
      const key = `${Date.now()}.${randomString()}`;
      return [key, _configs(t, tab, user, dailyMenu)];
    }
    return ["config", []];
  }, [user, dailyMenu, tab, t]);

  const dataLoader = useCallback(() => {
    return Array.from(allProducts.values()).filter((p) => !p.enabled);
  }, [allProducts]);

  const {
    condition,
    counter,
    data,
    filtered,
    keyword,
    names,
    reload,
    reset,
    updateCondition,
  } = useFilterData<Product, FilterType>({
    dataLoader,
    defaultCondition,
    filter,
  });

  const selectedProduct: Product[] = useMemo(() => {
    return productIds
      .map((productId) => allProducts.get(productId))
      .filter(Boolean) as Product[];
  }, [allProducts, productIds]);

  const { numberByTypes } = useMemo(() => {
    const numberByTypes = new Map<string, number>();
    selectedProduct.forEach((p) => {
      numberByTypes.set(
        p.others.type,
        (numberByTypes.get(p.others.type) || 0) + 1,
      );
    });

    return { numberByTypes };
  }, [selectedProduct]);

  return (
    <Box key={`${tab}.${key}`}>
      <Steppers
        onChange={store.setStatus}
        status={dailyMenu?.others.status}
        disabled={disabled}
      />
      <Flex
        align="center"
        justify="space-between"
        w="100%"
        ta="right"
        pb={10}
      >
        {!isCatering ? (
          <TabControll tab={tab} onChange={setActiveTab} />
        ) : (
          <>&nbsp;</>
        )}
        <Flex align="center" justify="space-between" gap={10}>
          <Button
            mt={10}
            disabled={disabled || !updated}
            onClick={save}
          >
            {t("Save")}
          </Button>
          <Button mt={10} onClick={() => navigate(-1)}>
            {t("Back to menu")}
          </Button>
        </Flex>
      </Flex>
      <Grid mt={10}>
        <Grid.Col span={isCatering ? 12 : 9}>
          {tab === "detail" && (
            <Box>
              {Array.from(numberByTypes.keys()).map((type, idx) => {
                return (
                  <Grid
                    key={idx}
                    mb={5}
                    w="15vw"
                    gutter="sm"
                    justify="center"
                    align="flex-start"
                  >
                    <Grid.Col key={`x.${idx}.1`} span={10}>
                      {t(`products.type.${type}`)}
                    </Grid.Col>
                    <Grid.Col key={`x.${type}.2`} span={2}>
                      {numberByTypes.get(type) || 0}
                    </Grid.Col>
                  </Grid>
                );
              })}
              <Flex
                gap={10}
                justify="start"
                align="start"
                className="c-catering-bdr-t"
                mt={10}
                pt={5}
              >
                <NumberInput
                  label={t("Total sets")}
                  w="160px"
                  step={1}
                />
                <NumberInput
                  disabled
                  label={t("Price per set")}
                  w="160px"
                  defaultValue={
                    20e3 + Math.floor(Math.random() * 20) * 1e3
                  }
                  suffix=" đ"
                  step={1000}
                />
                <NumberInput
                  disabled
                  label={t("Cost price")}
                  w="160px"
                  defaultValue={
                    10e3 + Math.floor(Math.random() * 20) * 1e3
                  }
                  suffix=" đ"
                  step={1000}
                />
                <NumberInput
                  disabled
                  label={t("Average cost price")}
                  w="160px"
                  defaultValue={
                    10e3 + Math.floor(Math.random() * 20) * 1e3
                  }
                  suffix=" đ"
                  step={1000}
                />
              </Flex>
            </Box>
          )}
          <DataGrid
            hasUpdateColumn={false}
            hasOrderColumn
            columns={configs}
            data={selectedProduct}
          />
        </Grid.Col>
        {!isCatering && (
          <Grid.Col span={3} className="c-catering-bdr-box">
            <Box key={counter}>
              <Flex justify="end" align={"center"} mb="1rem">
                <Select
                  label={t("Product type")}
                  w={"20vw"}
                  value={condition?.type || ""}
                  onChange={updateCondition.bind(null, "type", "")}
                  options={typeOptions}
                />
              </Flex>
              <Flex justify="end" align={"center"} mb="1rem">
                <AutocompleteForFilterData
                  w={"20vw"}
                  data={names}
                  defaultValue={keyword}
                  label={t("Cuisine name")}
                  onReload={reload}
                />
              </Flex>
            </Box>
            <Box ta="right" mb={10}>
              <Button disabled={!filtered} onClick={reset}>
                {t("Clear")}
              </Button>
            </Box>
            <ScrollArea h="80vh">
              <Selector
                disabled={disabled}
                data={data}
                selectedIds={productIds}
                onAdd={store.addProduct}
                onRemove={store.removeProduct}
                labelGenerator={(p) => `${p.name} - ${p.code}`}
              />
            </ScrollArea>
          </Grid.Col>
        )}
      </Grid>
    </Box>
  );
};

export default EditModal;
