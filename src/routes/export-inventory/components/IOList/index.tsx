import AutocompleteForFilterData from "@/components/c-catering/AutocompleteForFilterData";
import CustomButton from "@/components/c-catering/CustomButton";
import DataGrid from "@/components/common/DataGrid";
import DateRangeInput from "@/components/common/DateRangeInput";
import MultiSelect from "@/components/common/MultiSelect";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import {
  Department,
  PurchaseInternalCatering,
} from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import useMaterialStore from "@/stores/material.store";
import { OptionProps } from "@/types";
import { endOfDay, startOfDay } from "@/utils";
import { Button, Flex, Grid } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  useCallback,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import store from "../../_export.store";
import {
  defaultCondition,
  filter,
  FilterType,
  InternalDetail,
  piConfigs,
  piDetailConfigs,
} from "./_configs";

const IOList = () => {
  const t = useTranslation();
  const { activeCaterings } = useCateringStore();
  const { materials } = useMaterialStore();
  const { purchaseInternalCaterings, key } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
  );
  const [selectedPI, setSelectedPI] =
    useState<PurchaseInternalCatering>();

  const _caterings: OptionProps[] = useMemo(() => {
    return Array.from(activeCaterings.values()).map(
      (p: Department) => ({
        label: p.name,
        value: p.id,
      }),
    );
  }, [activeCaterings]);

  const dataGridConfigs = useMemo(
    () => piConfigs(t, activeCaterings),
    [t, activeCaterings],
  );

  const dataLoader = useCallback(() => {
    return Array.from(purchaseInternalCaterings);
  }, [purchaseInternalCaterings]);

  const {
    data,
    filtered,
    keyword,
    page,
    reload,
    reset,
    setPage,
    updateCondition,
    condition,
    names,
  } = useFilterData<PurchaseInternalCatering, FilterType>({
    dataLoader,
    filter,
    defaultCondition,
  });

  const detailDataGridConfigs = useMemo(
    () => piDetailConfigs(t, materials),
    [t, materials],
  );

  const detailDataLoader = useCallback(() => {
    const data = (selectedPI?.purchaseInternalDetails || []).map(
      (e) => ({
        ...e,
        name: e.id,
      }),
    );
    return Array.from(data);
  }, [selectedPI?.purchaseInternalDetails]);

  const {
    data: detailData,
    page: detailPage,
    setPage: setDetailPage,
  } = useFilterData<InternalDetail>({
    dataLoader: detailDataLoader,
  });

  const onChangeDateRange = (from?: number, to?: number) => {
    if (condition?.from && condition?.to && from && to) {
      const _from = startOfDay(from);
      const _to = endOfDay(to);
      if (from < condition.from || to > condition.to) {
        store.getPurchaseInternalData(_from, _to);
      }
      updateCondition("from", "", _from);
      updateCondition("to", "", to);
    }
  };

  const addToExportReceipt = () => {
    store.addPurchaseInternalToExportReceipt(selectedPI);
    notifications.show({
      color: "green.5",
      message: t("Add successfully"),
    });
  };

  return (
    <Flex key={activeCaterings.size} direction="column" gap={10}>
      <Flex gap={10} justify="end" align="end">
        <AutocompleteForFilterData
          label={t("Purchase internal io code")}
          w={"20vw"}
          data={names}
          defaultValue={keyword}
          onReload={reload}
        />
        <MultiSelect
          value={condition?.receivingCateringIds}
          label={t("Purchase internal receiving catering")}
          w={"20vw"}
          options={_caterings}
          onChange={updateCondition.bind(
            null,
            "receivingCateringIds",
            "",
          )}
        />
        <DateRangeInput
          label={t("Purchase internal date")}
          from={condition?.from}
          to={condition?.to}
          onChange={onChangeDateRange}
          w={"22vw"}
        />
        <CustomButton disabled={!filtered} onClick={reset}>
          {t("Clear")}
        </CustomButton>
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
            onRowClick={(item) => setSelectedPI(item)}
            selectedRow={selectedPI}
          />
        </Grid.Col>
        <Grid.Col span={6} mt={selectedPI ? 0 : 56}>
          <DataGrid
            key={key}
            page={detailPage}
            limit={5}
            isPaginated
            hasOrderColumn
            hasUpdateColumn={false}
            columns={detailDataGridConfigs}
            data={detailData}
            onChangePage={setDetailPage}
            noResultText=" "
          />
        </Grid.Col>
      </Grid>
    </Flex>
  );
};

export default IOList;
