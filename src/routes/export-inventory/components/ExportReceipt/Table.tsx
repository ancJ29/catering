import PurchaseTotal from "@/components/c-catering/PurchaseTotal";
import ScrollTable from "@/components/c-catering/ScrollTable";
import { Grid } from "@mantine/core";
import { useSyncExternalStore } from "react";
import { ExportDetail } from "../../_configs";
import store from "../../_export.store";
import Header from "./Header";
import Item from "./Item";

const Table = () => {
  const { exportDetails } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
  );
  return (
    <Grid mt={10}>
      <Grid.Col span={12} pb={0}>
        <div>
          <ScrollTable
            header={<Header />}
            h="calc(-8.5rem - 260px + 100vh)"
          >
            {Object.values(exportDetails).map(
              (exportDetail: ExportDetail, index: number) => (
                <Item
                  key={exportDetail.materialId}
                  index={index}
                  exportDetail={exportDetail}
                />
              ),
            )}
          </ScrollTable>
          <PurchaseTotal
            totalMaterial={store.getExportReceiptMaterialAmount()}
            totalPrice={store.getExportReceiptMaterialTotal()}
          />
        </div>
      </Grid.Col>
    </Grid>
  );
};

export default Table;
