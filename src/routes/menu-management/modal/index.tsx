import AutocompleteForFilterData from "@/components/c-catering/AutocompleteForFilterData";
import Selector from "@/components/c-catering/Selector";
import DataGrid from "@/components/common/DataGrid";
import NumberInput from "@/components/common/NumberInput";
import Select from "@/components/common/Select";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import {
  DailyMenu,
  DailyMenuStatus,
  Product,
  productTypeOptions,
  type DailyMenuDetailMode as Mode,
} from "@/services/domain";
import useAuthStore from "@/stores/auth.store";
import useProductStore from "@/stores/product.store";
import { OptionProps } from "@/types";
import { Box, Button, Flex, Grid, ScrollArea } from "@mantine/core";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import Steppers from "../components/Steppers";
import TabControll from "../components/TabControll";
import { _configs } from "./_config";
import { FilterType, defaultCondition, filter } from "./_filter";
import store from "./_item.store";

const EditModal = ({
  cateringId,
  dailyMenu,
  onSave,
}: {
  cateringId: string;
  dailyMenu?: DailyMenu;
  onSave: (
    status: DailyMenuStatus,
    quantity: Record<string, number>,
  ) => void;
}) => {
  const {
    item: updatedDailyMenu,
    productIds,
    updated,
  } = useSyncExternalStore(store.subscribe, store.getSnapshot);
  useEffect(() => store.set(dailyMenu), [dailyMenu]);

  const t = useTranslation();
  const { isCatering } = useAuthStore();
  const [tab, setActiveTab] = useState<Mode>(
    isCatering ? "modified" : "detail",
  );
  const { allTypes, products: allProducts } = useProductStore();
  const typeOptions: OptionProps[] = useMemo(
    () => productTypeOptions(allTypes, t),
    [allTypes, t],
  );

  const configs = useMemo(() => {
    return _configs(t, tab, cateringId, dailyMenu);
  }, [dailyMenu, cateringId, tab, t]);

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
    <Box>
      <Steppers
        onChange={store.setStatus}
        status={dailyMenu?.others.status}
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
        <Button
          mt={10}
          disabled={!updated}
          onClick={onSave.bind(
            null,
            updatedDailyMenu?.others.status || "NEW",
            updatedDailyMenu?.others.quantity || {},
          )}
        >
          {t("Save")}
        </Button>
      </Flex>
      <Grid mt={10}>
        <Grid.Col span={isCatering ? 12 : 9}>
          {tab === "detail" && (
            <Box>
              <Grid
                mb={5}
                w="15vw"
                gutter="sm"
                justify="center"
                align="flex-start"
              >
                {Array.from(numberByTypes.keys()).map((type) => {
                  return (
                    <>
                      <Grid.Col key={`${type}.1`} span={10}>
                        {t(`products.type.${type}`)}
                      </Grid.Col>
                      <Grid.Col key={`${type}.2`} span={2}>
                        {numberByTypes.get(type) || 0}
                      </Grid.Col>
                    </>
                  );
                })}
              </Grid>

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
            key={tab}
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
