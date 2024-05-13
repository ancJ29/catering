import PurchaseRequestFilter from "@/components/c-catering/PurchaseRequestFilter";
import DataGrid from "@/components/common/DataGrid";
import {
  FilterType,
  defaultCondition,
  filter,
} from "@/configs/filters/purchase-order";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import {
  PurchaseRequest,
  getPurchaseRequests,
} from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import { endOfDay, startOfDay } from "@/utils";
import { Flex, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useCallback, useEffect, useMemo, useState } from "react";
import { configs } from "./_config";

const PurchasingRequestManagement = () => {
  const t = useTranslation();
  const [purchaseRequests, setPurchaseRequests] = useState<
  PurchaseRequest[]
  >([]);
  const { caterings } = useCateringStore();

  const onOpenNote = useCallback(
    (id: string) => {
      const note = purchaseRequests.find((pr) => pr.id === id)?.others
        .note;
      modals.open({
        centered: true,
        withCloseButton: false,
        children: <Text size="sm">{note ?? t("No notes")}</Text>,
      });
    },
    [purchaseRequests, t],
  );

  const dataGridConfigs = useMemo(
    () => configs(t, caterings, onOpenNote),
    [t, caterings, onOpenNote],
  );

  const getData = async (from?: number, to?: number) => {
    setPurchaseRequests(await getPurchaseRequests(from, to));
  };

  useEffect(() => {
    getData();
  }, []);

  const dataLoader = useCallback(() => {
    return purchaseRequests;
  }, [purchaseRequests]);

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
  } = useFilterData<PurchaseRequest, FilterType>({
    dataLoader: dataLoader,
    filter,
    defaultCondition,
  });

  const onChangeDateRange = (from?: number, to?: number) => {
    if (condition?.from && condition?.to && from && to) {
      const _from = startOfDay(from);
      const _to = endOfDay(to);
      if (from < condition.from || to > condition.to) {
        getData(_from, _to);
      }
      updateCondition("from", "", _from);
      updateCondition("to", "", to);
    }
  };

  return (
    <Stack gap={10}>
      <Flex justify="end" align={"end"} gap={10} key={counter}>
        <PurchaseRequestFilter
          keyword={keyword}
          from={condition?.from}
          to={condition?.to}
          types={condition?.types}
          priorities={condition?.priorities}
          statuses={condition?.statuses}
          departmentIds={condition?.departmentIds}
          purchaseOrderIds={names}
          onReload={reload}
          onChangeTypes={updateCondition.bind(null, "types", "")}
          onChangePriorities={updateCondition.bind(
            null,
            "priorities",
            "",
          )}
          onChangeStatuses={updateCondition.bind(
            null,
            "statuses",
            "",
          )}
          onChangeDepartmentIds={updateCondition.bind(
            null,
            "departmentIds",
            "",
          )}
          onChangeDateRange={onChangeDateRange}
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

export default PurchasingRequestManagement;
