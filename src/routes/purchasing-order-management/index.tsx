import PurchaseOrderFilter from "@/components/c-catering/PurchaseOrderFilter";
import DataGrid from "@/components/common/DataGrid";
import {
  FilterType,
  defaultCondition,
  filter,
} from "@/configs/filters/purchase-order";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import { PurchaseOrder, getPurchaseOrders } from "@/services/domain";
import { ONE_DAY, endOfDay, startOfDay } from "@/utils";
import { Flex, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useCallback, useEffect, useMemo, useState } from "react";
import { configs } from "./_config";

const PurchasingOrderManagement = () => {
  const t = useTranslation();
  const [purchaseOrders, setPurchaseOrders] = useState<
  PurchaseOrder[]
  >([]);
  const [from, setFrom] = useState(startOfDay(Date.now() - ONE_DAY));
  const [to, setTo] = useState(startOfDay(Date.now() + ONE_DAY));

  const onOpenNote = useCallback(
    (id: string) => {
      const note = purchaseOrders.find((po) => po.id === id)?.others
        .note;
      modals.open({
        centered: true,
        withCloseButton: false,
        children: <Text size="sm">{note ?? t("No notes")}</Text>,
      });
    },
    [purchaseOrders, t],
  );

  const dataGridConfigs = useMemo(
    () => configs(t, onOpenNote),
    [t, onOpenNote],
  );

  const getData = async (from?: number, to?: number) => {
    setPurchaseOrders(await getPurchaseOrders(from, to));
  };

  useEffect(() => {
    getData();
  }, []);

  const dataLoader = useCallback(() => {
    return purchaseOrders;
  }, [purchaseOrders]);

  const {
    condition,
    counter,
    data,
    keyword,
    names,
    page,
    reload,
    setPage,
    updateCondition,
  } = useFilterData<PurchaseOrder, FilterType>({
    dataLoader: dataLoader,
    filter,
    defaultCondition,
  });

  const onChangeDateRange = (from?: number, to?: number) => {
    if (!from || !to) {
      return;
    }
    setFrom(from);
    setTo(to);
  };

  const onFilter = () => {
    if (condition?.from && condition?.to) {
      const _from = startOfDay(from);
      const _to = endOfDay(to);
      if (from < condition.from || to > condition.to) {
        getData(_from, _to);
      }
      updateCondition("from", "", _from);
      updateCondition("to", "", _to);
    }
  };

  return (
    <Stack gap={10}>
      <Flex justify="end" align={"end"} gap={10} key={counter}>
        <PurchaseOrderFilter
          keyword={keyword}
          from={from}
          to={to}
          type={condition?.type}
          priority={condition?.priority}
          status={condition?.status}
          departmentName={condition?.departmentName}
          purchaseOrderIds={names}
          onReload={reload}
          onChangeType={updateCondition.bind(null, "type", "")}
          onChangePriority={updateCondition.bind(
            null,
            "priority",
            "",
          )}
          onChangeStatus={updateCondition.bind(null, "status", "")}
          onChangeDepartmentName={updateCondition.bind(
            null,
            "departmentName",
            "",
          )}
          onChangeDateRange={onChangeDateRange}
          onFilter={onFilter}
        />
      </Flex>
      <DataGrid
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

export default PurchasingOrderManagement;
