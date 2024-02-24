import { Actions } from "@/auto-generated/api-configs";
import Selector from "@/components/c-catering/Selector";
import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import callApi from "@/services/api";
import { Supplier, getSupplierById } from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import useSupplierStore from "@/stores/supplier.store";
import { GenericObject } from "@/types";
import {
  Box,
  Button,
  Flex,
  Grid,
  ScrollArea,
  Text,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Catering, configs } from "./_config";
import AutocompleteForFilterData from "@/components/c-catering/AutocompleteForFilterData";

const SupplierCateringManagement = () => {
  const { reload: reloadCatering, caterings: cateringById } =
    useCateringStore();
  const { supplierId } = useParams();
  const t = useTranslation();
  const { set } = useSupplierStore();
  const [supplier, setSupplier] = useState<Supplier>();
  const [changed, setChanged] = useState(false);
  const [caterings, setCaterings] = useState<Catering[]>([]);
  const [fee] = useState<Map<string, number>>(new Map());

  const cateringIds = useMemo(
    () => caterings.map((c) => c.id),
    [caterings],
  );

  const load = useCallback(async () => {
    if (!supplierId) {
      return;
    }
    await reloadCatering();
    const supplier = await getSupplierById(supplierId);
    if (!supplier) {
      return;
    }
    set([supplier]);
    setSupplier(supplier);
    setCaterings(
      (supplier.others.caterings || [])
        .map((c) => {
          if (!cateringById.has(c.cateringId)) {
            return;
          }
          return {
            ...cateringById.get(c.cateringId),
            price: c.additionalFee,
          };
        })
        .filter(Boolean) as Catering[],
    );
  }, [supplierId, reloadCatering, set, cateringById]);

  useOnMounted(load);

  const dataLoader = useCallback(() => {
    return Array.from(cateringById.values());
  }, [cateringById]);

  const { data, names, reload } = useFilterData<Catering>({
    dataLoader,
  });

  const addCatering = useCallback(
    (cateringId: string) => {
      setChanged(true);
      setCaterings((prev) => {
        const catering = cateringById.get(cateringId);
        if (!catering) {
          return prev;
        }
        return [...(prev || []), catering];
      });
    },
    [cateringById],
  );

  const removeCatering = useCallback((cateringId: string) => {
    setChanged(true);
    setCaterings((prev) => {
      return prev?.filter((c) => c.id !== cateringId);
    });
  }, []);

  const dataGridConfigs = useMemo(() => {
    return configs(t, removeCatering, setFee);
    function setFee(cateringId: string, _fee: number) {
      fee.set(cateringId, _fee);
      setChanged(true);
    }
  }, [fee, removeCatering, t]);

  const save = useCallback(() => {
    modals.openConfirmModal({
      title: t("Update changes"),
      children: (
        <Text size="sm">{t("Are you sure to save changes?")}</Text>
      ),
      labels: { confirm: "OK", cancel: t("Cancel") },
      onConfirm: async () => {
        if (!supplier) {
          return;
        }
        const _supplier: GenericObject = supplier;
        delete _supplier.id;
        await callApi<unknown, { success: boolean }>({
          action: Actions.UPDATE_SUPPLIER,
          params: {
            ..._supplier,
            id: supplierId,
            others: {
              ...supplier.others,
              caterings: caterings.map((c) => {
                return {
                  cateringId: c.id,
                  additionalFee: fee.get(c.id) ?? c.price ?? 0,
                };
              }),
            },
          },
          options: {
            toastMessage: t("Your changes have been saved"),
          },
        });
        setChanged(false);
        load();
      },
    });
  }, [caterings, fee, load, supplier, supplierId, t]);

  if (!caterings || !data.length) {
    return <></>;
  }
  return (
    <Box>
      <Box w="100%" pb={10}>
        <Flex w="100%" align="center" justify="space-between">
          <Text className="c-catering-font-bold" size="2rem">
            {supplier?.name || "N/A"}
            {" - "}
            {t("Supplier supplied catering")}
          </Text>
          <Button disabled={!changed} onClick={save}>
            {t("Save")}
          </Button>
        </Flex>
        <Grid mt={10}>
          <Grid.Col span={9}>
            <DataGrid
              hasUpdateColumn={false}
              hasOrderColumn
              columns={dataGridConfigs}
              data={caterings}
            />
          </Grid.Col>
          <Grid.Col span={3} className="c-catering-bdr-box">
            <AutocompleteForFilterData
              mr={10}
              mb={10}
              label={t("Catering name")}
              data={names}
              onReload={reload}
            />
            <ScrollArea h="80vh">
              <Selector
                data={data}
                selectedIds={cateringIds}
                onAdd={addCatering}
                onRemove={removeCatering}
              />
            </ScrollArea>
          </Grid.Col>
        </Grid>
      </Box>
    </Box>
  );
};

export default SupplierCateringManagement;
