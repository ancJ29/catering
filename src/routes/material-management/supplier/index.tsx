import { Actions } from "@/auto-generated/api-configs";
import Autocomplete from "@/components/common/Autocomplete";
import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import callApi from "@/services/api";
import {
  Material,
  Supplier,
  getMaterialById,
} from "@/services/domain";
import useMaterialStore from "@/stores/material.store";
import useSupplierStore from "@/stores/supplier.store";
import {
  Box,
  Button,
  Flex,
  Grid,
  ScrollArea,
  Text,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCircleMinus, IconCirclePlus } from "@tabler/icons-react";
import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { SupplierMaterial, configs } from "./_config";

const MaterialSupplierManagement = () => {
  const { materialId } = useParams();
  const { set } = useMaterialStore();
  const { reload: reloadSuppliers, suppliers: supplierById } =
    useSupplierStore();
  const t = useTranslation();
  const [changed, setChanged] = useState(false);
  const [material, setMaterial] = useState<Material>();
  const [prices] = useState<Map<string, number>>(new Map());
  const [suppliers, setSuppliers] = useState<SupplierMaterial[]>([]);

  const load = useCallback(async () => {
    await reloadSuppliers();
    if (!materialId) {
      return;
    }
    setChanged(false);
    const material = await getMaterialById(materialId);
    if (material) {
      setMaterial(material);
      set([material]);
    }
    setSuppliers(
      (
        material?.supplierMaterials.map((sm: SupplierMaterial) => ({
          price: sm.price,
          supplier: {
            id: sm.supplier.id,
            name: sm.supplier.name,
          },
        })) || []
      ).sort((a, b) => a.price - b.price),
    );
  }, [reloadSuppliers, materialId, set]);

  useOnMounted(load);

  const reload = useCallback(() => {
    if (supplierById.size) {
      return Array.from(supplierById.values());
    }
    return [];
  }, [supplierById]);

  const { data, names, filter, change } = useFilterData<Supplier>({
    reload,
  });

  const addSupplier = useCallback(
    (supplierId: string, suppliers: Map<string, Supplier>) => {
      setChanged(true);
      setSuppliers((prev) => {
        const supplier = suppliers.get(supplierId);
        if (!supplier) {
          return prev;
        }
        return [
          ...(prev || []),
          {
            price: 0,
            supplier: {
              id: supplier.id,
              name: supplier.name,
            },
          },
        ];
      });
    },
    [],
  );

  const removeSupplier = useCallback((supplierId: string) => {
    setChanged(true);
    setSuppliers((prev) => {
      return prev?.filter((sm) => sm.supplier.id !== supplierId);
    });
  }, []);

  const dataGridConfigs = useMemo(() => {
    if (!material) {
      return [];
    }
    return configs(t, material, prices, setPrice, removeSupplier);
    function setPrice(supplierId: string, price: number) {
      prices.set(supplierId, price);
    }
  }, [material, prices, t, removeSupplier]);

  const save = useCallback(() => {
    if (
      suppliers?.some((sm) => {
        return sm.price <= 0 && !prices.get(sm.supplier.id);
      })
    ) {
      notifications.show({
        color: "red.5",
        message: t("Please input price for all materials"),
      });
      return;
    }
    modals.openConfirmModal({
      title: t("Update changes"),
      children: (
        <Text size="sm">{t("Are you sure to save changes?")}</Text>
      ),
      labels: { confirm: "OK", cancel: t("Cancel") },
      onConfirm: async () => {
        if (!suppliers) {
          return;
        }
        await callApi<unknown, { success: boolean }>({
          action: Actions.UPDATE_MATERIAL_SUPPLIER,
          params: {
            materialId,
            suppliers: suppliers.map((sm) => {
              return {
                supplierId: sm.supplier.id,
                price: prices.get(sm.supplier.id) ?? sm.price,
              };
            }),
          },
          options: {
            toastMessage: t("Your changes have been saved"),
          },
        });
        load();
      },
    });
  }, [load, materialId, prices, suppliers, t]);

  if (!supplierById || !material) {
    return <></>;
  }
  return (
    <Box>
      <Box w="100%" pb={10}>
        <Flex w="100%" align="center" justify="space-between">
          <Text className="c-catering-font-bold" size="2rem">
            {material?.name || "-"} - {t("Suppliers")}
          </Text>
          <Button disabled={!changed} onClick={save}>
            {t("Save")}
          </Button>
        </Flex>
        <Grid mt={10}>
          <Grid.Col span={9}>
            {supplierById.size && (
              <DataGrid
                hasUpdateColumn={false}
                hasOrderColumn
                columns={dataGridConfigs}
                data={suppliers}
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
              mb={10}
            />
            <ScrollArea h="80vh">
              {data.map((supplier) => {
                const existed = suppliers.some(
                  (sm) => sm.supplier.id === supplier.id,
                );
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
                    key={supplier.id}
                    w="100%"
                    p={10}
                    mb={4}
                    onClick={() => {
                      if (existed) {
                        removeSupplier(supplier.id);
                      } else {
                        addSupplier(supplier.id, supplierById);
                      }
                    }}
                  >
                    <Flex gap={5}>
                      <Icon />
                      <span style={{ fontSize: ".8rem" }}>
                        {supplier.name}
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

export default MaterialSupplierManagement;