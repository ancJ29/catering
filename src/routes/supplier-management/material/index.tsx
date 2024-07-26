import { Actions } from "@/auto-generated/api-configs";
import CustomButton from "@/components/c-catering/CustomButton";
import MaterialListButton from "@/components/c-catering/MaterialListButton";
import MaterialSelector from "@/components/c-catering/MaterialSelector";
import DataGrid from "@/components/common/DataGrid";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import callApi from "@/services/api";
import {
  Material,
  Supplier,
  getSupplierById,
} from "@/services/domain";
import useMaterialStore from "@/stores/material.store";
import useSupplierStore from "@/stores/supplier.store";
import { Box, Flex, Grid, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { SupplierMaterial, configs } from "./_configs";

const SupplierMaterialManagement = () => {
  const { supplierId } = useParams();
  const t = useTranslation();
  const { set } = useSupplierStore();
  const { materials: materialById } = useMaterialStore();
  const [supplier, setSupplier] = useState<Supplier>();
  const [prices] = useState<Map<string, number>>(new Map());
  const [changed, setChanged] = useState(false);
  const [materials, setMaterials] = useState<SupplierMaterial[]>();
  const [opened, { toggle }] = useDisclosure(false);

  const load = useCallback(async () => {
    if (!supplierId) {
      return;
    }
    const supplier = await getSupplierById(supplierId);
    if (!supplier) {
      return;
    }
    setChanged(false);
    set([supplier]);
    setSupplier(supplier);
    setMaterials(
      supplier?.supplierMaterials.map((sm: SupplierMaterial) => ({
        price: sm.price,
        material: {
          id: sm.material.id,
          name: sm.material.name.split("___")[0],
        },
      })) || [],
    );
  }, [supplierId, set]);

  useOnMounted(load);

  const addMaterial = useCallback(
    (materialId: string) => {
      setChanged(true);
      setMaterials((prev) => {
        const material = materialById.get(materialId);
        if (!material) {
          return prev;
        }
        return [
          ...(prev || []),
          {
            price: 0,
            material: {
              id: material.id,
              name: material.name,
            },
          },
        ];
      });
    },
    [materialById],
  );

  const removeMaterial = useCallback(
    (materialId: string) => {
      modals.openConfirmModal({
        title: t("Remove material"),
        children: (
          <Text size="sm">
            {t("Are you sure you want to remove material?")}
          </Text>
        ),
        labels: { confirm: "OK", cancel: t("Cancel") },
        onCancel: () => {
          modals.closeAll();
        },
        onConfirm: async () => {
          setChanged(true);
          setMaterials((prev) => {
            return prev?.filter(
              (sm) => sm.material.id !== materialId,
            );
          });
        },
      });
    },
    [t],
  );

  const dataGridConfigs = useMemo(() => {
    return materialById.size
      ? configs(t, materialById, setPrice, removeMaterial)
      : [];

    function setPrice(materialId: string, price: number) {
      setChanged(true);
      prices.set(materialId, price);
    }
  }, [materialById, prices, removeMaterial, t]);

  const save = useCallback(async () => {
    if (
      materials?.some((sm) => {
        return sm.price <= 0 && !prices.get(sm.material.id);
      })
    ) {
      notifications.show({
        color: "red.5",
        message: t("Please input price for all materials"),
      });
      return;
    }
    if (!materials) {
      return;
    }
    await callApi<unknown, { success: boolean }>({
      action: Actions.UPDATE_SUPPLIER_MATERIAL,
      params: {
        supplierId,
        materials: materials.map((sm) => {
          return {
            materialId: sm.material.id,
            price: prices.get(sm.material.id) ?? sm.price,
          };
        }),
      },
      options: {
        toastMessage: "Your changes have been saved",
      },
    });
    load();
  }, [load, materials, prices, supplierId, t]);

  const labelGenerator = useCallback(
    (material: Material) => {
      const type = material.others.type;
      return (
        <span style={{ fontSize: ".8rem" }}>
          {material.name}
          &nbsp;
          <span>({t(`materials.type.${type}`)})</span>
        </span>
      );
    },
    [t],
  );

  return (
    <Box>
      <Box w="100%" pb={10}>
        <Flex w="100%" align="center" justify="space-between">
          <Text className="c-catering-font-bold" size="2rem">
            {supplier?.name || "N/A"}
            {" - "}
            {t("Supplier supplied material")}
          </Text>
          <Flex display="flex" direction="column">
            <CustomButton disabled={!changed} onClick={save} confirm>
              {t("Save")}
            </CustomButton>
            <MaterialListButton
              opened={opened}
              onClick={toggle}
              mt="0.5rem"
            />
          </Flex>
        </Flex>
        <Grid mt={10}>
          <Grid.Col span={opened ? 9 : 12}>
            {materialById.size && (
              <DataGrid
                hasUpdateColumn={false}
                hasOrderColumn
                columns={dataGridConfigs}
                data={materials}
              />
            )}
          </Grid.Col>
          <Grid.Col
            span={3}
            className="c-catering-bdr-box"
            style={{ display: opened ? "block" : "none" }}
          >
            <MaterialSelector
              onAdd={addMaterial}
              onRemove={removeMaterial}
              labelGenerator={labelGenerator}
              materialIds={materials?.map((e) => e.material.id)}
            />
          </Grid.Col>
        </Grid>
      </Box>
    </Box>
  );
};

export default SupplierMaterialManagement;
