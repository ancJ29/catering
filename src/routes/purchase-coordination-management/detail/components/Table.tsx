import MaterialSelector from "@/components/c-catering/MaterialSelector";
import PurchaseTotal from "@/components/c-catering/PurchaseTotal";
import ScrollTable from "@/components/c-catering/ScrollTable";
import useTranslation from "@/hooks/useTranslation";
import { Material } from "@/services/domain";
import useMaterialStore from "@/stores/material.store";
import { Grid } from "@mantine/core";
import { useCallback, useSyncExternalStore } from "react";
import store from "../_purchase-coordination-detail.store";
import Header from "./Header";
import Item from "./Item";

type TableProps = {
  opened: boolean;
  disabled: boolean;
};

const Table = ({ opened, disabled }: TableProps) => {
  const t = useTranslation();
  const { materials } = useMaterialStore();
  const { materialIds, currents } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
  );

  const addMaterial = (materialId: string) => {
    store.addMaterial(materialId);
  };

  const removeMaterial = (materialId: string) => {
    store.removeMaterial(materialId);
  };

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
    <Grid mt={10}>
      <Grid.Col span={opened ? 9 : 12} pb={0}>
        <div>
          <ScrollTable
            header={<Header />}
            h="calc(-8.5rem - 240px + 100vh)"
          >
            {materialIds.map((materialId) => (
              <Item
                key={materialId}
                material={materials.get(materialId)}
                coordinationDetail={currents[materialId]}
                price={store.getPrice(materialId)}
                supplierData={store.getSupplierData(materialId)}
                onChangeOrderQuantity={(value) =>
                  store.setQuantity(materialId, value)
                }
                onChangSupplierNote={(value) =>
                  store.setSupplierNote(materialId, value)
                }
                onChangeInternalNote={(value) =>
                  store.setInternalNote(materialId, value)
                }
                onChangeSupplierId={(value) =>
                  store.setSupplierId(materialId, value)
                }
                removeMaterial={() =>
                  store.removeMaterial(materialId)
                }
                disabled={disabled}
              />
            ))}
          </ScrollTable>
          <PurchaseTotal
            totalMaterial={store.getTotalMaterial()}
            totalPrice={store.getTotalPrice()}
          />
        </div>
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
          materialIds={materialIds}
          h="calc(-5.5rem - 205px + 100vh)"
        />
      </Grid.Col>
    </Grid>
  );
};

export default Table;
