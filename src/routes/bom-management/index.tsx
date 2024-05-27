import CateringBar from "@/components/c-catering/CateringBar";
import CustomButton from "@/components/c-catering/CustomButton";
import MaterialListButton from "@/components/c-catering/MaterialListButton";
import MaterialSelector from "@/components/c-catering/MaterialSelector";
import useLoading from "@/hooks/useLoading";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import useUrlHash from "@/hooks/useUrlHash";
import notificationStore from "@/services/api/store/notification";
import { getBom, pushBom } from "@/services/domain";
import { Flex, Grid, Stack } from "@mantine/core";
import { useCounter, useDisclosure } from "@mantine/hooks";
import {
  useCallback,
  useReducer,
  useState,
  useSyncExternalStore,
} from "react";
import store from "./_bom.store";
import {
  ActionType,
  FilterType,
  Tab,
  _customizeKey,
  defaultCondition,
  reducer,
} from "./_config";
import BomTable from "./components/BomTable";
import CostTable from "./components/CostTable";
import ProductFilter from "./components/ProductFilter";
import Tabs from "./components/Tabs";

const BomManagement = () => {
  useOnMounted(store.reset);

  const t = useTranslation();
  const [opened, { toggle }] = useDisclosure(false);
  const [counter, { increment }] = useCounter(0);
  const [condition, dispatch] = useReducer(reducer, defaultCondition);

  const toggleLoading = useLoading();
  const { updatedAt, bom, materialIds, updated } =
    useSyncExternalStore(store.subscribe, store.getSnapshot);

  const select = useCallback(
    (productId: string) => {
      increment();
      dispatch({
        type: ActionType.OVERRIDE,
        overrideState: { productId },
      });
      toggleLoading(600);
      getBom(productId).then((bom) => {
        bom ? store.set(bom) : store.init(productId);
        increment();
      });
    },
    [increment, toggleLoading],
  );

  const clear = useCallback(() => {
    increment();
    dispatch({ type: ActionType.CLEAR_PRODUCT_ID });
    store.reset();
  }, [increment]);

  const [errorAmounts, setErrorAmounts] =
    useState<Record<string, number>>();

  const save = useCallback(() => {
    const customizeKey = _customizeKey(condition);
    let amounts = Object.entries(bom?.bom || {});
    if (customizeKey) {
      amounts = Object.entries(
        bom?.others?.customized?.[customizeKey] || {},
      );
    }
    if (amounts.some(([, amount]) => amount < 1)) {
      notificationStore.push({
        color: "red.5",
        message: "Amount should be greater than 0",
      });
      setErrorAmounts(Object.fromEntries(amounts));
      return;
    }
    setErrorAmounts(undefined);
    bom &&
      pushBom(bom).then(() => {
        const productId = bom.productId;
        getBom(productId).then((bom) => {
          bom ? store.set(bom) : store.init(productId);
          increment();
        });
      });
  }, [bom, condition, increment]);

  const callback = useCallback(
    (condition: FilterType) => {
      dispatch({
        type: ActionType.OVERRIDE,
        overrideState: condition,
      });
      if (condition.productId) {
        select(condition.productId);
      }
    },
    [select],
  );

  useUrlHash(condition, callback);

  const isStandard = condition.tab === Tab.STANDARD;

  return (
    <Stack gap={10}>
      <Tabs
        activeTab={condition.tab}
        setActiveTab={(tab) => {
          dispatch({ type: ActionType.CHANGE_TAB, tab });
        }}
      />
      <Grid mt={10} style={{ zIndex: 100 }}>
        <Grid.Col span={opened ? 9 : 12}>
          <Flex
            align="flex-end"
            justify="space-between"
            w="100%"
            mb={10}
          >
            <ProductFilter
              key={counter}
              productId={condition.productId}
              onSelect={select}
              onClear={clear}
            />
            <CustomButton confirm disabled={!updated} onClick={save}>
              {t("Save")}
            </CustomButton>
          </Flex>
          {!isStandard && (
            <Flex gap={10} justify="start" align="end" mb={10}>
              <CateringBar
                allowAllTarget
                enableShift
                shift={condition.shift}
                shifts={condition.target?.shifts || []}
                customer={condition.customer}
                targetName={condition.target?.name || ""}
                cateringId={condition.cateringId}
                onChangeCateringId={(cateringId) =>
                  dispatch({
                    type: ActionType.UPDATE_CATERING_ID,
                    cateringId,
                  })
                }
                onChangeShift={(shift) =>
                  dispatch({
                    type: ActionType.OVERRIDE,
                    overrideState: { shift },
                  })
                }
                onTargetChange={(target: {
                  name: string;
                  shifts: string[];
                }) =>
                  dispatch({
                    type: ActionType.OVERRIDE,
                    overrideState: { target },
                  })
                }
                onCustomerChange={(customer) =>
                  dispatch({
                    type: ActionType.UPDATE_CUSTOMER,
                    customer,
                  })
                }
                onClear={() =>
                  dispatch({
                    type: ActionType.CLEAR,
                    keys: [
                      "target",
                      "shift",
                      "customer",
                      "cateringId",
                    ],
                  })
                }
                onClearTarget={() => {
                  dispatch({
                    type: ActionType.CLEAR,
                    keys: ["target", "shift"],
                  });
                }}
              />
            </Flex>
          )}
          {Boolean(isStandard || condition.cateringId) && (
            <BomTable
              condition={condition}
              errorAmounts={errorAmounts}
            />
          )}
          {Boolean(
            !isStandard &&
              condition.cateringId &&
              condition.productId,
          ) && <CostTable key={updatedAt} condition={condition} />}
        </Grid.Col>
        {opened && (
          <Grid.Col
            span={3}
            className="c-catering-bdr-box"
            style={{
              cursor: condition.productId ? "auto" : "not-allowed",
              opacity: condition.productId ? 1 : 0.2,
            }}
          >
            {condition.productId && (
              <MaterialSelector
                disabled={!condition.productId}
                // key={`${materialIds.length}.${counter}`}
                key={counter}
                materialIds={materialIds}
                onAdd={store.add}
                onRemove={store.remove}
              />
            )}
          </Grid.Col>
        )}
      </Grid>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "5vw",
          height: "100vh",
          backgroundColor: "transparent",
          zIndex: 0,
        }}
      >
        <MaterialListButton
          opened={opened}
          onClick={toggle}
          style={{
            zIndex: 100,
            cursor: "pointer",
            position: "absolute",
            top: "8.6vh",
            right: 0,
            margin: "1rem",
          }}
        />
      </div>
    </Stack>
  );
};

export default BomManagement;
