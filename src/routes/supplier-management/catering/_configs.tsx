import NumberInput from "@/components/common/NumberInput";
import { Department } from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import { Button } from "@mantine/core";

export type Catering = Department & {
  price?: number;
};

export const configs = (
  t: (key: string) => string,
  removeCatering: (cateringId: string) => void,
  setFee: (cateringId: string, fee: number) => void,
): DataGridColumnProps[] => {
  return [
    {
      key: "name",
      header: t("Catering name"),
      width: "25%",
      textAlign: "left",
      defaultVisible: true,
      renderCell(_, row: Catering) {
        return <span>{row.name || "-"}</span>;
      },
    },
    {
      key: "address",
      header: t("Catering address"),
      width: "25%",
      defaultVisible: true,
      renderCell(_, row: Catering) {
        return <span>{row?.address || "N/A"}</span>;
      },
    },
    {
      key: "addition-fee",
      width: "200px",
      header: t("Supplier catering addition fee"),
      renderCell(_, row: Catering) {
        return (
          <NumberInput
            defaultValue={row.price || 0}
            suffix=" đ"
            step={1000}
            onChange={(fee) => setFee(row?.id || "", fee)}
            onBlurWithValue={(fee) => setFee(row?.id || "", fee)}
          />
        );
      },
    },
    {
      key: "remove",
      style: { flexGrow: 1 },
      textAlign: {
        cell: "right",
      },
      renderCell(_, row: Catering) {
        return (
          <Button
            mr={10}
            size="compact-xs"
            variant="light"
            color="error"
            onClick={removeCatering.bind(null, row.id)}
          >
            {t("Remove")}
          </Button>
        );
      },
    },
  ];
};
