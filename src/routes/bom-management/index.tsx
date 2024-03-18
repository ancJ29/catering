import CateringBar from "@/components/c-catering/CateringBar";
import CustomButton from "@/components/c-catering/CustomButton";
import MaterialSelector from "@/components/c-catering/MaterialSelector";
import useLoading from "@/hooks/useLoading";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import useUrlHash from "@/hooks/useUrlHash";
import { getBom, pushBom } from "@/services/domain";
import { Flex, Grid, Stack } from "@mantine/core";
import { useCounter } from "@mantine/hooks";
import { useCallback, useReducer, useSyncExternalStore } from "react";
import store from "./_bom.store";
import {
  ActionType,
  FilterType,
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
      <Grid mt={10}>
        <Grid.Col span={9}>
          <Flex
            align="flex-end"
            justify="space-between"
            w="100%"
            mb={10}
          >
            <ProductFilter
              key={condition.productId || "-"}
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
