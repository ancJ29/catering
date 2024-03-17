import CateringBar from "@/components/c-catering/CateringBar";
import MaterialSelector from "@/components/c-catering/MaterialSelector";
import useLoading from "@/hooks/useLoading";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import { getBom, pushBom } from "@/services/domain";
import { Button, Flex, Grid, Stack } from "@mantine/core";
import { useCounter } from "@mantine/hooks";
import { useCallback, useReducer, useSyncExternalStore } from "react";
import store from "./_bom.store";
import {
  ActionType,
  Tab,
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
      });
    },
    [increment, toggleLoading],
  );

  const clear = useCallback(() => {
    increment();
    dispatch({ type: ActionType.CLEAR_PRODUCT_ID });
    store.reset();
  }, [increment]);

  const save = useCallback(() => {
    bom && pushBom(bom);
  }, [bom]);

  const isStandard = condition.tab === Tab.STANDARD;

  return (
    <Stack gap={10}>
      <Tabs
        activeTab={condition.tab}
        setActiveTab={(tab) => {
          dispatch({ type: ActionType.CHANGE_TAB, tab });
        }}
      />
      <Grid mt={10}>
        <Grid.Col span={9}>
          <Flex
            align="flex-end"
            justify="space-between"
            w="100%"
            mb={10}
          >
            <ProductFilter onSelect={select} onClear={clear} />
            <Button disabled={!updated} onClick={save}>
              {t("Save")}
            </Button>
          </Flex>
          {!isStandard && (
            <Flex gap={10} justify="start" align="end">
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
            <BomTable condition={condition} />
          )}
          {Boolean(
            !isStandard &&
              condition.cateringId &&
              condition.productId,
          ) && <CostTable key={updatedAt} condition={condition} />}
        </Grid.Col>
        <Grid.Col span={3} className="c-catering-bdr-box">
          <MaterialSelector
            disabled={!condition.productId}
            key={`${materialIds.length}.${counter}`}
            materialIds={materialIds}
            onAdd={store.add}
            onRemove={store.remove}
          />
        </Grid.Col>
      </Grid>
    </Stack>
  );
};

export default BomManagement;
