/* eslint-disable @typescript-eslint/no-unused-vars */
import { Actions } from "@/auto-generated/api-configs";
import Autocomplete from "@/components/common/Autocomplete";
import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import callApi from "@/services/api";
import {
  getAllMaterials,
  Material,
  Supplier,
} from "@/services/domain";
import logger from "@/services/logger";
import { DataGridColumnProps } from "@/types";
import {
  Box,
  Button,
  Flex,
  Grid,
  NumberInput,
  ScrollArea,
  Text,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconCircleMinus, IconCirclePlus } from "@tabler/icons-react";
import { useCallback, useMemo, useState } from "react";

type SupplierMaterial = {
  price: number;
  material: {
    id: string;
    name: string;
  };
};

const _configs = (
  removeMaterial: (materialId: string) => void,
  t: (key: string) => string,
  materialById: Map<string, Material>,
  setPrice: (materialId: string, price: number) => void,
): DataGridColumnProps[] => {
  return [
    {
      key: "name",
      header: t("Material name"),
      width: "35%",
      textAlign: "left",
      renderCell(_, sm: SupplierMaterial) {
        return <span>{sm.material.name}</span>;
      },
    },
    {
      key: "price",
      header: t("Material price"),
      width: "10%",
      textAlign: "left",
      renderCell(_, sm: SupplierMaterial) {
        return (
          <NumberInput
            suffix=" đ"
            thousandSeparator="."
            decimalSeparator=","
            defaultValue={sm.price}
            onBlur={(e) => {
              let price = parseInt(
                e.target.value.replace(/\./g, "").replace(/,/g, "."),
              );
              logger.info(`price: ${price}`, e.target.value);
              if (isNaN(price) || price < 0) {
                price = 0;
              }
              setPrice(sm.material.id, price);
            }}
          />
        );
      },
    },
    {
      key: "type",
      header: t("Material type"),
      width: "15%",
      textAlign: "center",
      renderCell: (_, sm: SupplierMaterial) => {
        const material = materialById.get(sm.material.id);
        if (!material?.others?.type) {
          return "N/A";
        }
        const code = material.others.type;
        const type = t(`materials.type.${code}`);
        return <span>{`${type} (${code})`}</span>;
      },
    },
    {
      key: "group",
      header: t("Material group"),
      width: "10%",
      textAlign: "center",
      renderCell: (_, sm: SupplierMaterial) => {
        const material = materialById.get(sm.material.id);
        if (!material?.others?.type) {
          return material?.name || "N/A";
        }
        const code = material.others.group;
        const group = t(`materials.group.${code}`);
        return <span>{`${group} (${code})`}</span>;
      },
    },
    {
      key: "remove",
      style: { flexGrow: 1 },
      renderCell(_, sm: SupplierMaterial) {
        return (
          <Button
            mr={10}
            onClick={removeMaterial.bind(null, sm.material.id)}
          >
            {t("Remove")}
          </Button>
        );
      },
    },
  ];
};

const MaterialManagement = ({
  supplier,
  onSuccess,
}: {
  supplier: Supplier;
  onSuccess: () => void;
}) => {
  const t = useTranslation();
  const [changed, setChanged] = useState(false);
  const { data, records, names, filter, change } =
    useFilterData<Material>({
      reload: getAllMaterials,
    });
  const materialById = useMemo(() => {
    return new Map(
      Array.from(records.values()).map((m) => [m.id, m]),
    );
  }, [records]);
  const [materials, setMaterials] = useState<SupplierMaterial[]>(
    supplier.supplierMaterials.map((sm: SupplierMaterial) => {
      return {
        price: sm.price,
        material: {
          id: sm.material.id,
          name: sm.material.name,
        },
      };
    }),
  );

  const enabled = useMemo(() => {
    return !materials.some((sm) => sm.price <= 0);
  }, [materials]);

  const addMaterial = useCallback(
    (materialId: string) => {
      setChanged(true);
      setMaterials((prev) => {
        const material = materialById.get(materialId);
        if (!material) {
          return prev;
        }
        return [
          ...prev,
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
      return prev.filter((sm) => sm.material.id !== materialId);
    });
  }, []);

  const setPrice = useCallback(
    (materialId: string, price: number) => {
      setChanged(true);
      setMaterials((prev) => {
        logger.info(`set price ${price} for material ${materialId}`);
        return prev.map((sm) => {
          if (sm.material.id === materialId) {
            return { ...sm, price };
          }
          return sm;
        });
      });
    },
    [],
  );

  const configs = useMemo(() => {
    return materialById.size
      ? _configs(removeMaterial, t, materialById, setPrice)
      : [];
  }, [materialById, removeMaterial, t, setPrice]);

  const save = useCallback(() => {
    modals.openConfirmModal({
      title: t("Update changes"),
      children: (
        <Text size="sm">{t("Are you sure to save changes?")}</Text>
      ),
      labels: { confirm: "OK", cancel: t("Cancel") },
      onConfirm: async () => {
        const res = await callApi<unknown, { success: boolean }>({
          action: Actions.UPDATE_SUPPLIER_MATERIAL,
          params: {
            supplierId: supplier.id,
            materials: materials.map((sm) => {
              return {
                materialId: sm.material.id,
                price: sm.price,
              };
            }),
          },
          options: {
            toastMessage: t("Your changes have been saved"),
          },
        });
        res && onSuccess();
      },
    });
  }, [onSuccess, materials, supplier, t]);

  return (
    <Box>
      <Box w="100%" ta="right" pb={10}>
        <Button disabled={!changed || !enabled} onClick={save}>
          {t("Save")}
        </Button>
        <Grid mt={10}>
          <Grid.Col span={9}>
            {records.size && (
              <DataGrid
                hasUpdateColumn={false}
                hasOrderColumn
                columns={configs}
                data={materials}
              />
            )}
          </Grid.Col>
          <Grid.Col span={3} className="c-catering-bdr-box">
            <Flex justify="end" align={"center"} mb="1rem">
              <Autocomplete
                w={"20vw"}
                onEnter={filter}
                data={names}
                onChange={change}
              />
            </Flex>
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
                        addMaterial(material.id);
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

export default MaterialManagement;
