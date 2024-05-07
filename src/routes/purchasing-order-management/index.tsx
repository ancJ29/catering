import PurchaseOrderFilter from "@/components/c-catering/PurchaseOrderFilter";
import DataGrid from "@/components/common/DataGrid";
import {
  FilterType,
  defaultCondition,
  filter,
} from "@/configs/filters/purchase-order";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import {
  PurchaseOrder,
  getAllPurchaseOrders,
} from "@/services/domain";
import usePurchaseOrderStore from "@/stores/purchase-order.store";
import { ONE_DAY } from "@/utils";
import { Flex, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useCallback, useMemo, useState } from "react";
import { configs } from "./_config";

const PurchasingOrderManagement = () => {
  const t = useTranslation();
  const { purchaseOrders, set } = usePurchaseOrderStore();

  const onOpenNote = useCallback(
    (id: string) => {
      const note = purchaseOrders.get(id)?.others.note;
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
  const [from, setFrom] = useState<number | undefined>(
    Date.now() - ONE_DAY,
  );
  const [to, setTo] = useState<number | undefined>(
    Date.now() + ONE_DAY,
  );

  const dataLoader = useCallback(() => {
    return Array.from(purchaseOrders.values()).map((el) => ({
      ...el,
      name: el.others.internalCode,
    }));
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
    dataLoader,
    filter,
    defaultCondition,
  });

  const onChangeDateRange = (from?: number, to?: number) => {
    setFrom(from);
    setTo(to);
  };

  const onFilter = async () => {
    const data = await getAllPurchaseOrders(false, from, to);
    set(data);
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
