import { Department } from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import { positivePrice } from "@/utils";
import { Button, NumberInput } from "@mantine/core";
import { useState } from "react";

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
      renderCell(_, row: Catering) {
        return <span>{row.name || "-"}</span>;
      },
    },
    {
      key: "address",
      header: t("Catering address"),
      width: "25%",
      renderCell(_, row: Catering) {
        return <span>{row?.others.address || "N/A"}</span>;
      },
    },
    {
      key: "addition-fee",
      width: "200px",
      header: t("Supplier catering addition fee"),
      renderCell(_, row: Catering) {
        const Component = () => {
          const [fee, setInternalFee] = useState(row.price || 0);
          return (
            <NumberInput
              value={fee}
              thousandSeparator="."
              decimalSeparator=","
              suffix=" đ"
              step={1000}
              onChange={(value) => {
                const fee = positivePrice(value);
                setInternalFee(fee);
                setFee(row?.id || "", fee);
              }}
              onBlur={() => {
                fee && setFee(row?.id || "", fee);
              }}
            />
          );
        };
        return <Component />;
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
