import {
  Actions,
  smStatusSchema,
} from "@/auto-generated/api-configs";
import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import callApi from "@/services/api";
import { Material, pushMaterial } from "@/services/domain";
import useAuthStore from "@/stores/auth.store";
import useMaterialStore from "@/stores/material.store";
import useSupplierStore from "@/stores/supplier.store";
import { Stack } from "@mantine/core";
import { useCallback, useMemo, useState } from "react";
import {
  filter as _filter,
  configs,
  defaultCondition,
  FilterType,
} from "./_configs";
import Filter from "./components/Filter";

const QuotationManagement = () => {
  const t = useTranslation();
  const { materials, reload: reloadMaterials } = useMaterialStore();
  const { cateringId } = useAuthStore();
  const { suppliers } = useSupplierStore();
  const [prices] = useState<Map<string, number>>(new Map());

  const dataGridConfigs = useMemo(() => {
    return configs(
      t,
      cateringId,
      suppliers,
      prices,
      setPrice,
      onApprove,
    );
    function setPrice(materialId: string, price: number) {
      prices.set(materialId, price);
    }
    async function onApprove(
      materialId: string,
      newPrice: number,
      supplierId: string,
    ) {
      const price = prices.get(materialId) || newPrice;
      const material = materials.get(materialId);
      if (!material) {
        return;
      }
      await Promise.all([
        pushMaterial({
          ...material,
          others: {
            ...material.others,
            prices: {
              ...material.others.prices,
              [cateringId || ""]: {
                id:
                  material.others.prices?.[cateringId || ""]?.id ||
                  "",
                supplierId:
                  material.others.prices?.[cateringId || ""]
                    ?.supplierId || "",
                price,
              },
            },
          },
        }),
        callApi<unknown, { success: boolean }>({
          action: Actions.UPDATE_SUPPLIER_MATERIAL,
          params: {
            supplierId,
            materials: [
              {
                materialId,
                price,
                status: smStatusSchema.Values.DXL,
              },
            ],
          },
        }),
      ]);
      reloadMaterials(true);
    }
  }, [cateringId, materials, prices, reloadMaterials, suppliers, t]);

  const dataLoader = useCallback(() => {
    return Array.from(materials.values());
  }, [materials]);

  const filter = useCallback(
    (el: Material, filter?: FilterType | undefined) => {
      return _filter(el, filter, cateringId);
    },
    [cateringId],
  );

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
  } = useFilterData<Material, FilterType>({
    dataLoader: dataLoader,
    filter,
    defaultCondition,
  });

  return (
    <Stack key={suppliers.size} gap={10}>
      <Filter
        condition={condition}
        keyword={keyword}
        names={names}
        filtered={filtered}
        reset={reset}
        reload={reload}
        updateCondition={updateCondition}
        setCondition={setCondition}
      />
      <DataGrid
        key={page}
        page={page}
        limit={10}
        isPaginated
        hasOrderColumn
        columns={dataGridConfigs}
        data={data}
        onChangePage={setPage}
        hasUpdateColumn={false}
      />
    </Stack>
  );
};

export default QuotationManagement;
