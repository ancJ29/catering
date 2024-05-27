import MaterialSelector from "@/components/c-catering/MaterialSelector";
import ScrollTable from "@/components/c-catering/ScrollTable";
import useTranslation from "@/hooks/useTranslation";
import { Material } from "@/services/domain";
import { Grid } from "@mantine/core";
import { useCallback, useSyncExternalStore } from "react";
import store from "../../_inventory.store";
import Header from "./Header";
import Item from "./Item";
import Total from "./Total";

type PurchaseRequestTableProps = {
  opened: boolean;
};

const PurchaseRequestTable = ({
  opened,
}: PurchaseRequestTableProps) => {
  const t = useTranslation();
  const { materialIds } = useSyncExternalStore(
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
            h="calc(-8.5rem - 200px + 100vh)"
          >
            {materialIds.map((materialId) => (
              <Item key={materialId} materialId={materialId} />
            ))}
          </ScrollTable>
          <Total />
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

export default PurchaseRequestTable;
