import { Actions } from "@/auto-generated/api-configs";
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
} from "@/services/domain";
import useMaterialStore from "@/stores/material.store";
import useMetaDataStore from "@/stores/meta-data.store";
import useSupplierStore from "@/stores/supplier.store";
import { OptionProps } from "@/types";
import { unique } from "@/utils";
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

const SupplierMaterialManagement = () => {
  const { supplierId } = useParams();
  const t = useTranslation();
  const { set } = useSupplierStore();
  const { materialGroupByType } = useMetaDataStore();
  const [supplier, setSupplier] = useState<Supplier>();
  const [prices] = useState<Map<string, number>>(new Map());
  const { reload: reloadMaterial, materials: materialById } =
    useMaterialStore();
  const [changed, setChanged] = useState(false);
  const [materials, setMaterials] = useState<SupplierMaterial[]>();
  const [group, setGroup] = useState<string | null>("");
  const [type, setType] = useState<string | null>("");

  const [groupOptions, typeOptions] = useMemo(() => {
    const typeOptions = unique(
      Array.from(materialById.values()).map((m) => m.others.type),
    ).map((m) => ({
      label: t(`materials.type.${m}`),
      value: m as string,
    }));
    let groupOptions: OptionProps[] = [];
    if (type) {
      if (type in materialGroupByType) {
        groupOptions = materialGroupByType[type].map((g) => ({
          label: t(`materials.group.${g}`),
          value: g,
        }));
      }
    } else {
      groupOptions = unique(
        Array.from(materialById.values()).map((m) => m.others.group),
      ).map((m) => ({
        label: t(`materials.group.${m}`),
        value: m as string,
      }));
    }
    return [groupOptions, typeOptions];
  }, [materialById, type, materialGroupByType, t]);

  const load = useCallback(async () => {
    if (!supplierId) {
      return;
    }
    reloadMaterial();
    const supplier = await getSupplierById(supplierId);
    if (!supplier) {
      return;
    }
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

  const reload = useCallback(() => {
    if (materialById.size) {
      return Array.from(materialById.values());
    }
    return [];
  }, [materialById]);

  const {
    data: _data,
    records,
    names,
    filter,
    change,
  } = useFilterData<Material>({ reload });

  const addMaterial = useCallback(
    (materialId: string, materials: Map<string, Material>) => {
      setChanged(true);
      setMaterials((prev) => {
        const material = materials.get(materialId);
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
    [],
  );

  const data = useMemo(() => {
    return _data.filter((m) => {
      if (group && m.others.group !== group) {
        return false;
      }
      if (type && m.others.type !== type) {
        return false;
      }
      return true;
    });
  }, [_data, group, type]);

  const removeMaterial = useCallback((materialId: string) => {
    setChanged(true);
    setMaterials((prev) => {
      return prev?.filter((sm) => sm.material.id !== materialId);
    });
  }, []);

  const dataGridConfigs = useMemo(() => {
    return materialById.size
      ? configs(removeMaterial, t, materialById, setPrice)
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
        const res = await callApi<unknown, { success: boolean }>({
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
        res?.success && load();
      },
    });
  }, [load, materials, prices, supplierId, t]);

  const changeType = useCallback((value: string | null) => {
    setType((type) => {
      if (type !== value) {
        setGroup("");
        return value || "";
      }
      return type;
    });
  }, []);

  const clear = useCallback(() => {
    setGroup("");
    setType("");
    filter("");
    setChanged(false);
  }, [filter]);

  if (!materials || !_data.length) {
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
            {records.size && (
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
                key={type}
                value={type}
                label={t("Material type")}
                w={"20vw"}
                options={typeOptions}
                onChange={changeType}
              />
            </Flex>
            {type && (
              <Flex justify="end" align={"center"} mb="1rem">
                <Select
                  key={type}
                  label={t("Material group")}
                  value={group}
                  w={"20vw"}
                  options={groupOptions}
                  onChange={setGroup}
                />
              </Flex>
            )}
            <Flex justify="end" align={"center"} mb="1rem">
              <Autocomplete
                label={t("Material name")}
                w={"20vw"}
                onEnter={filter}
                data={names}
                onChange={change}
              />
            </Flex>
            <Box ta="right">
              <Button disabled={!type} onClick={clear}>
                {t("Clear")}
              </Button>
            </Box>
            <ScrollArea h="80vh">
              {data.map((material) => {
                const existed = materials.some(
                  (sm) => sm.material.id === material.id,
                );
                const type = material.others.type;
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
                    key={material.id}
                    w="100%"
                    p={10}
                    mb={4}
                    onClick={() => {
                      if (existed) {
                        removeMaterial(material.id);
                      } else {
                        addMaterial(material.id, materialById);
                      }
                    }}
                  >
                    <Flex gap={5}>
                      <Icon />
                      <span style={{ fontSize: ".8rem" }}>
                        {material.name}
                        &nbsp;
                        <span>({t(`materials.type.${type}`)})</span>
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

export default SupplierMaterialManagement;
