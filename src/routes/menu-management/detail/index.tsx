import { Actions } from "@/auto-generated/api-configs";
import AutocompleteForFilterData from "@/components/c-catering/AutocompleteForFilterData";
import CustomButton from "@/components/c-catering/CustomButton";
import Selector from "@/components/c-catering/Selector";
import DataGrid from "@/components/common/DataGrid";
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
import useCustomerStore from "@/stores/customer.store";
import useDailyMenuStore from "@/stores/daily-menu.store";
import useProductStore from "@/stores/product.store";
import { OptionProps } from "@/types";
import {
  ONE_DAY,
  ONE_MINUTE,
  buildHash,
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
import {
  FilterType as BomFilterType,
  Tab,
} from "../../bom-management/_config";
import Steppers from "../components/Steppers";
import Summarize from "../components/Summarize";
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
  const { customers } = useCustomerStore();
  const {
    item: updatedDailyMenu,
    productIds,
    updated,
  } = useSyncExternalStore(store.subscribe, store.getSnapshot);
  const { allTypes, products: allProducts } = useProductStore();

  useOnMounted(store.reset);

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
      store.set(parsedParams.customer.others.cateringId, record);
      return;
    }
    const mark = startOfDay(parsedParams.timestamp);
    getDailyMenu({
      customerIds: [parsedParams.customerId],
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
        store.set(parsedParams.customer.others.cateringId, record);
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
        (productId: string) => {
          const target = parsedParams.customer.others.targets.find(
            (target) => {
              return target.name === parsedParams.targetName;
            },
          );
          navigate(
            `/bom-management#${buildHash({
              productId,
              tab: Tab.CUSTOMIZED,
              customer: parsedParams.customer,
              target,
              shift: parsedParams.shift,
              cateringId: parsedParams.customer.others.cateringId,
            } satisfies BomFilterType)}`,
          );
        },
        dailyMenu,
      );
      return [`${Date.now()}.${randomString()}`, configs];
    }
    return ["config", []];
  }, [user, dailyMenu, tab, parsedParams, disabled, t, navigate]);

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
            updatedDailyMenu.others.itemByType || {},
            updatedDailyMenu.others.estimatedQuantity || 0,
            updatedDailyMenu.others.total || 0,
            updatedDailyMenu.others.price || 0,
            updatedDailyMenu.others.quantity,
          ).then((res) => {
            if (res?.length) {
              pushDailyMenu(res);
              store.set(
                parsedParams.customer.others.cateringId,
                res[0],
              );
              setDailyMenu(res[0]);
            }
          }),
      });
  }, [updatedDailyMenu, parsedParams, t, pushDailyMenu]);

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
          <Summarize
            selectedProduct={selectedProduct}
            disabled={isCatering || disabled || tab === "modified"}
          />
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
                  value={condition?.type}
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
              <CustomButton disabled={!filtered} onClick={reset}>
                {t("Clear")}
              </CustomButton>
            </Box>
            <ScrollArea h="80vh">
              <Selector
                disabled={disabled}
                data={data}
                selectedIds={productIds}
                onAdd={store.addProduct}
                onRemove={store.removeProduct}
                labelGenerator={(p) =>
                  `${p.name} - ${p.others.internalCode}`
                }
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
  itemByType: Record<string, number>,
  estimatedQuantity: number,
  total: number,
  price: number,
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
        itemByType,
        price: price || 0,
        estimatedQuantity: estimatedQuantity || 0,
        total: total || 0,
        shift: params.shift,
        customerId: params.customerId,
        targetName: params.targetName,
      },
    })) || {};
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const res = await getDailyMenu({
    id,
    noCache: true,
    customerIds: [params.customerId],
    from: params.timestamp - ONE_DAY,
    to: params.timestamp + ONE_DAY,
  });
  loadingStore.stopLoading();
  return res;
}

// function _skipZero(quantity: Record<string, number>) {
//   Object.keys(quantity).forEach((productId) => {
//     if (quantity[productId] < 1) {
//       delete quantity[productId];
//     }
//   });
//   return quantity;
// }
