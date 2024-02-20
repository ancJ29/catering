import { Actions } from "@/auto-generated/api-configs";
import Autocomplete from "@/components/common/Autocomplete";
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
import { IconCircleMinus, IconCirclePlus } from "@tabler/icons-react";
import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Catering, configs } from "./_config";

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
      supplier.others.caterings
        ?.map((c) => {
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

  const reload = useCallback(() => {
    if (cateringById.size) {
      return Array.from(cateringById.values());
    }
    return [];
  }, [cateringById]);

  const { data, records, names, filter, change } =
    useFilterData<Catering>({ reload });

  const addCatering = useCallback(
    (cateringId: string, cateringById: Map<string, Catering>) => {
      setChanged(true);
      setCaterings((prev) => {
        const catering = cateringById.get(cateringId);
        if (!catering) {
          return prev;
        }
        return [...(prev || []), catering];
      });
    },
    [],
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
        delete _supplier.others;
        delete _supplier.id;
        await callApi<unknown, { success: boolean }>({
          action: Actions.UPDATE_SUPPLIER,
          params: {
            ..._supplier,
            id: supplierId,
            others: {
              ...supplier?.others,
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
            reloadOnSuccess: true,
          },
        });
      },
    });
  }, [caterings, fee, supplier, supplierId, t]);

  if (!cateringById.size || !data.length) {
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
            {records.size && (
              <DataGrid
                hasUpdateColumn={false}
                hasOrderColumn
                columns={dataGridConfigs}
                data={caterings}
              />
            )}
          </Grid.Col>
          <Grid.Col span={3} className="c-catering-bdr-box">
            <Autocomplete
              mr={10}
              label={t("Catering name")}
              onEnter={filter}
              data={names}
              onChange={change}
            />
            <ScrollArea h="80vh">
              {data.map((catering) => {
                const existed = false;
                const Icon = existed
                  ? IconCircleMinus
                  : IconCirclePlus;
                return (
                  <Box
                    style={{
                      cursor: "pointer",
                      borderRadius: "5px",
                    }}
                    bg={existed ? "primary.4" : undefined}
                    className="c-catering-hover-bg"
                    key={catering.id}
                    w="100%"
                    p={10}
                    mb={4}
                    onClick={() => {
                      if (existed) {
                        removeCatering(catering.id);
                      } else {
                        addCatering(catering.id, cateringById);
                      }
                    }}
                  >
                    <Flex gap={5}>
                      <Icon />
                      <span style={{ fontSize: ".8rem" }}>
                        {catering.name}
                      </span>
                    </Flex>
                  </Box>
                );
              })}
            </ScrollArea>
          </Grid.Col>
        </Grid>
      </Box>
    </Box>
  );
};

export default SupplierCateringManagement;
