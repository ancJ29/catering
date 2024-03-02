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
  Customer,
  DailyMenu,
  DailyMenuStatus,
  Product,
  dailyMenuKey,
  editableDailyMenu,
  getDailyMenu,
  productTypeOptions,
  type DailyMenuDetailMode as Mode,
} from "@/services/domain";
import useAuthStore from "@/stores/auth.store";
import useCateringStore from "@/stores/catering.store";
import useCustomerStore from "@/stores/customer.store";
import useDailyMenuStore from "@/stores/daily-menu.store";
import useProductStore from "@/stores/product.store";
import { OptionProps } from "@/types";
import {
  ONE_DAY,
  ONE_MINUTE,
  decodeUri,
  randomString,
  startOfDay,
} from "@/utils";
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
  useEffect,
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

type Params = {
  timestamp: number;
  customerId: string;
  shift: string;
  targetName: string;
  customer: Customer;
  key: string;
};

const EditModal = () => {
  const params = useParams();
  const t = useTranslation();
  const navigate = useNavigate();
  const [dailyMenu, setDailyMenu] = useState<DailyMenu>();
  const [parsedParams, setParsedParams] = useState<Params>();
  const [disabled, setDisabled] = useState(false);
  const { isCatering, user, role, cateringId } = useAuthStore();
  const [tab, setActiveTab] = useState<Mode>(
    isCatering ? "modified" : "detail",
  );
  const { dailyMenu: records, push: pushDailyMenu } =
    useDailyMenuStore();
  const { reload: loadAllCaterings } = useCateringStore();
  const { customers, reload: loadAllCustomers } = useCustomerStore();
  const {
    item: updatedDailyMenu,
    productIds,
    updated,
  } = useSyncExternalStore(store.subscribe, store.getSnapshot);
  const {
    allTypes,
    products: allProducts,
    reload: loadAllProducts,
  } = useProductStore();

  /*
  http://localhost:9000/menu-management#Vy4xOTc3Ny5jbHQ4N2drMncwMDdlMTBvODFzZXU0eXZvLllVV0ElMjAxLlMlRTElQkElQTNuJTIweHUlRTElQkElQTV0JTIwMS5DYSUyMDE=
  */

  const onMounted = useCallback(async () => {
    store.reset();
    loadAllCustomers();
    loadAllCaterings();
    loadAllProducts();
  }, [loadAllCaterings, loadAllCustomers, loadAllProducts]);

  useOnMounted(onMounted);

  useEffect(() => {
    if (
      !parsedParams?.key &&
      customers?.size &&
      params.customerName
    ) {
      setParsedParams(_parse(params, customers));
    }
  }, [params, parsedParams, customers]);

  useEffect(() => {
    parsedParams &&
      role &&
      setDisabled(
        !editableDailyMenu(
          role,
          parsedParams.timestamp,
          updatedDailyMenu,
          cateringId,
        ),
      );
  }, [cateringId, disabled, parsedParams, updatedDailyMenu, role]);

  useEffect(() => {
    if (!parsedParams || dailyMenu) {
      return;
    }

    const record = records.get(parsedParams.key);
    if (record) {
      setDailyMenu(record);
      store.set(record);
      return;
    }
    const mark = startOfDay(parsedParams.timestamp);
    getDailyMenu({
      customerId: parsedParams.customerId,
      from: mark - ONE_MINUTE,
      to: mark + ONE_MINUTE,
    }).then((res) => {
      res.length && pushDailyMenu(res);
      const record = res.find((el) => {
        if (el.others.shift === parsedParams.shift) {
          if (el.others.targetName === parsedParams.targetName) {
            return true;
          }
        }
        return false;
      });
      if (record) {
        setDailyMenu(record);
        store.set(record);
      }
    });
  }, [dailyMenu, records, parsedParams, pushDailyMenu]);

  const typeOptions: OptionProps[] = useMemo(
    () => productTypeOptions(allTypes, t),
    [allTypes, t],
  );

  const [configKey, configs] = useMemo(() => {
    if (user && parsedParams) {
      const configs = _configs(
        t,
        tab,
        user,
        parsedParams.customer.others.cateringId,
        disabled,
        dailyMenu,
      );
      return [`${Date.now()}.${randomString()}`, configs];
    }
    return ["config", []];
  }, [user, dailyMenu, tab, parsedParams, disabled, t]);

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

  const save = useCallback(() => {
    parsedParams &&
      updatedDailyMenu &&
      modals.openConfirmModal({
        title: `${t("Update menu")}`,
        children: (
          <Text size="sm">
            {t("Are you sure you want to save menu?")}
          </Text>
        ),
        labels: { confirm: "OK", cancel: t("Cancel") },
        onConfirm: () =>
          _save(
            parsedParams,
            updatedDailyMenu.others.status,
            _skipZero(updatedDailyMenu.others.quantity),
          ).then((res) => {
            if (res?.length) {
              pushDailyMenu(res);
              store.set(res[0]);
              setDailyMenu(res[0]);
            }
            window.history.length > 2 && navigate(-1);
          }),
      });
  }, [updatedDailyMenu, parsedParams, t, pushDailyMenu, navigate]);

  return (
    <Box key={`${tab}.${configKey}`}>
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
          {window.history.length > 2 && (
            <Button mt={10} onClick={() => navigate(-1)}>
              {t("Back to menu")}
            </Button>
          )}
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

function _parse(
  params: Record<string, string | undefined>,
  customers: Map<string, Customer>,
): Params | undefined {
  const { timestamp, customerName, shift, targetName } = {
    customerName: decodeUri(params.customerName || ""),
    targetName: decodeUri(params.targetName || ""),
    shift: decodeUri(params.shift || ""),
    timestamp: parseInt(params.timestamp || "0"),
  };
  const customer = Array.from(customers.values()).find((el) => {
    return el.name === customerName;
  });
  const target = customer?.others.targets?.find(
    (t) => t.name === targetName,
  );
  if (!customer || !target) {
    return;
  }
  return {
    key: dailyMenuKey(customer.id, targetName, shift, timestamp || 0),
    timestamp,
    customerId: customer.id,
    shift,
    customer,
    targetName,
  };
}

async function _save(
  params: Params,
  status: DailyMenuStatus,
  quantity: Record<string, number>,
) {
  loadingStore.startLoading();
  const { id } =
    (await callApi<unknown, { id: string }>({
      action: Actions.PUSH_DAILY_MENU,
      params: {
        date: new Date(startOfDay(params.timestamp)),
        status,
        quantity,
        targetName: params.targetName,
        shift: params.shift,
        customerId: params.customerId,
      },
    })) || {};
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const res = await getDailyMenu({
    id,
    noCache: true,
    customerId: params.customerId,
    from: params.timestamp - ONE_DAY,
    to: params.timestamp + ONE_DAY,
  });
  loadingStore.stopLoading();
  return res;
}

function _skipZero(quantity: Record<string, number>) {
  Object.keys(quantity).forEach((productId) => {
    if (quantity[productId] < 1) {
      delete quantity[productId];
    }
  });
  return quantity;
}
