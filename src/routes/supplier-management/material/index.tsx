import { Actions } from "@/auto-generated/api-configs";
import Selector from "@/components/c-catering/Selector";
import Autocomplete from "@/components/common/Autocomplete";
import DataGrid from "@/components/common/DataGrid";
import Select from "@/components/common/Select";
import useFilterData from "@/hooks/useFilterData";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import callApi from "@/services/api";
import {
  Material,
  Supplier,
  getSupplierById,
  typeAndGroupOptions,
} from "@/services/domain";
import useMaterialStore from "@/stores/material.store";
import useMetaDataStore from "@/stores/meta-data.store";
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
import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FilterType,
  SupplierMaterial,
  configs,
  defaultCondition,
  filter,
} from "./_config";

const SupplierMaterialManagement = () => {
  const { supplierId } = useParams();
  const t = useTranslation();
  const { set } = useSupplierStore();
  const { materialGroupByType } = useMetaDataStore();
  const { reload: reloadMaterial, materials: materialById } =
    useMaterialStore();
  const [supplier, setSupplier] = useState<Supplier>();
  const [prices] = useState<Map<string, number>>(new Map());
  const [changed, setChanged] = useState(false);
  const [materials, setMaterials] = useState<SupplierMaterial[]>();
  const materialIds = useMemo(
    () => materials?.map((sm) => sm.material.id) || [],
    [materials],
  );

  const load = useCallback(async () => {
    if (!supplierId) {
      return;
    }
    reloadMaterial();
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
          name: sm.material.name,
        },
      })) || [],
    );
  }, [supplierId, set, reloadMaterial]);

  useOnMounted(load);

  const dataLoader = useCallback(() => {
    return Array.from(materialById.values());
  }, [materialById]);

  const {
    counter,
    condition,
    data,
    filtered,
    names,
    keyword,
    onKeywordChanged,
    reload,
    reset,
    setCondition,
    updateCondition,
  } = useFilterData<Material, FilterType>({
    dataLoader,
    filter,
    defaultCondition,
  });

  const [typeOptions, groupOptions] = useMemo(() => {
    return typeAndGroupOptions(
      materialGroupByType,
      condition?.type || "",
      t,
    );
  }, [materialGroupByType, t, condition]);

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

  const removeMaterial = useCallback((materialId: string) => {
    setChanged(true);
    setMaterials((prev) => {
      return prev?.filter((sm) => sm.material.id !== materialId);
    });
  }, []);

  const dataGridConfigs = useMemo(() => {
    return materialById.size
      ? configs(t, materialById, setPrice, removeMaterial)
      : [];

    function setPrice(materialId: string, price: number) {
      setChanged(true);
      prices.set(materialId, price);
    }
  }, [materialById, prices, removeMaterial, t]);

  const save = useCallback(() => {
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
    modals.openConfirmModal({
      title: t("Update changes"),
      children: (
        <Text size="sm">{t("Are you sure to save changes?")}</Text>
      ),
      labels: { confirm: "OK", cancel: t("Cancel") },
      onConfirm: async () => {
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
            toastMessage: t("Your changes have been saved"),
          },
        });
        load();
      },
    });
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

  if (!materials || !data.length) {
    return <></>;
  }
  return (
    <Box>
      <Box w="100%" pb={10}>
        <Flex w="100%" align="center" justify="space-between">
          <Text className="c-catering-font-bold" size="2rem">
            {supplier?.name || "N/A"}
            {" - "}
            {t("Supplier supplied material")}
          </Text>
          <Button disabled={!changed} onClick={save}>
            {t("Save")}
          </Button>
        </Flex>
        <Grid mt={10}>
          <Grid.Col span={9}>
            {materialById.size && (
              <DataGrid
                hasUpdateColumn={false}
                hasOrderColumn
                columns={dataGridConfigs}
                data={materials}
              />
            )}
          </Grid.Col>
          <Grid.Col span={3} className="c-catering-bdr-box">
            <Flex justify="end" align={"center"} mb="1rem">
              <Select
                key={condition?.type || ""}
                value={condition?.type || ""}
                label={t("Material type")}
                w={"20vw"}
                options={typeOptions}
                onChange={(value) =>
                  value !== condition?.type &&
                  setCondition({
                    type: value || "",
                    group: "",
                  })
                }
                mb={10}
              />
            </Flex>
            <Flex justify="end" align={"center"} mb="1rem">
              <Select
                key={condition?.group || ""}
                label={t("Material group")}
                value={condition?.group}
                w={"20vw"}
                options={groupOptions}
                onChange={updateCondition.bind(null, "group", "")}
              />
            </Flex>
            <Flex justify="end" align={"center"} mb="1rem">
              <Autocomplete
                key={counter}
                defaultValue={keyword}
                label={t("Material name")}
                w={"20vw"}
                onEnter={reload}
                data={names}
                onChange={onKeywordChanged}
              />
            </Flex>
            <Box ta="right" mb={10}>
              <Button disabled={!filtered} onClick={reset}>
                {t("Clear")}
              </Button>
            </Box>
            <ScrollArea h="80vh">
              <Selector
                data={data}
                selectedIds={materialIds}
                onAdd={addMaterial}
                onRemove={removeMaterial}
                labelGenerator={labelGenerator}
              />
            </ScrollArea>
          </Grid.Col>
        </Grid>
      </Box>
    </Box>
  );
};

export default SupplierMaterialManagement;
