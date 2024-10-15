import AddButton from "@/components/c-catering/AddButton";
import DataGrid from "@/components/common/DataGrid";
import {
  FilterType,
  defaultCondition,
  filter,
} from "@/configs/filters/purchase-request";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import useUrlHash from "@/hooks/useUrlHash";
import {
  PurchaseRequest,
  getPurchaseRequests,
} from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import { endOfDay, startOfDay } from "@/utils";
import { Stack } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { configs } from "./_configs";
import Filter from "./components/Filter";

const PurchaseRequestManagement = () => {
  const t = useTranslation();
  const navigate = useNavigate();
  const [purchaseRequests, setPurchaseRequests] = useState<
  PurchaseRequest[]
  >([]);
  const { caterings } = useCateringStore();

  const dataGridConfigs = useMemo(
    () => configs(t, caterings),
    [t, caterings],
  );

  const getData = async (from?: number, to?: number) => {
    setPurchaseRequests(await getPurchaseRequests(from, to));
  };

  useEffect(() => {
    getData();
  }, []);

  const location = useLocation();
  useEffect(() => {
    if (location.state?.refresh) {
      getData();
    }
  }, [location.state]);

  const dataLoader = useCallback(() => {
    return purchaseRequests;
  }, [purchaseRequests]);

  const {
    condition,
    data,
    keyword,
    names,
    page,
    reload,
    setPage,
    updateCondition,
    setCondition,
    filtered,
    reset,
  } = useFilterData<PurchaseRequest, FilterType>({
    dataLoader: dataLoader,
    filter,
    defaultCondition,
  });

  const onChangeDateRange = useCallback(
    (from?: number, to?: number) => {
      if (condition?.from && condition?.to && from && to) {
        const _from = startOfDay(from);
        const _to = endOfDay(to);
        if (from < condition.from || to > condition.to) {
          getData(_from, _to);
        }
        updateCondition("from", "", _from);
        updateCondition("to", "", to);
      }
    },
    [condition?.from, condition?.to, updateCondition],
  );

  const callback = useCallback(
    (condition: FilterType) => {
      setCondition(condition);
      onChangeDateRange(condition?.from, condition?.to);
    },
    [onChangeDateRange, setCondition],
  );
  useUrlHash(condition ?? defaultCondition, callback);

  const onRowClick = (item: PurchaseRequest) => {
    navigate(`/purchase-request-management/${item.id}`);
  };

  const addPurchaseRequest = () => {
    navigate("/purchase-request-management/add");
  };

  return (
    <Stack gap={10} key={caterings.size} pos="relative">
      <AddButton
        onClick={addPurchaseRequest}
        label="Add purchase request"
      />
      <Filter
        condition={condition}
        keyword={keyword}
        names={names}
        filtered={filtered}
        reset={reset}
        reload={reload}
        updateCondition={updateCondition}
        onChangeDateRange={onChangeDateRange}
      />
      <DataGrid
        onRowClick={onRowClick}
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

export default PurchaseRequestManagement;
