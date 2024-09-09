import { DataGridProps } from "@/types";
import Laptop from "./Laptop";
import Mobile from "./Mobile";
import { GenericObjectWithModificationInformation } from "./_configs";

function DataGrid<T extends GenericObjectWithModificationInformation>(
  props: DataGridProps<T>,
) {
  return (
    <>
      <Laptop {...props} />
      <Mobile {...props} />
    </>
  );
}

export default DataGrid;
