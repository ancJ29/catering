import { Actions } from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import callApi from "@/services/api";
import { Customer } from "@/services/domain";
import useProductStore from "@/stores/product.store";
import { formatTime, stopMouseEvent } from "@/utils";
import { Box, Modal, Table, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { useCallback, useMemo } from "react";
import EditModal from "./EditModal";
import MenuItem from "./MenuItem";

type CellProps = {
  targetName: string;
  shift: string;
  date?: string;
  timestamp?: number;
  customer?: Customer;
  quantity: Map<string, number>;
  onReload: () => void;
};

const Cell = ({
  quantity,
  targetName,
  shift,
  date,
  timestamp,
  customer,
  onReload,
}: CellProps) => {
  const { products: allProducts } = useProductStore();
  const t = useTranslation();
  const [opened, { open, close }] = useDisclosure(false);
  const title = useMemo(() => {
    if (!customer) {
      return "";
    }

    const date = formatTime(timestamp, "YYYY-MM-DD");
    return `${date}: ${customer.name} > ${targetName} > ${shift}`;
  }, [customer, shift, targetName, timestamp]);

  const save = useCallback(
    (quantity: Map<string, number>) => {
      if (!timestamp || !customer) {
        close();
        return;
      }
      for (const [productId, count] of quantity) {
        if (count === 0) {
          quantity.delete(productId);
        }
      }
      modals.openConfirmModal({
        title: `${t("Update menu")}`,
        children: (
          <Text size="sm">
            {t("Are you sure you want to save menu?")}
          </Text>
        ),
        labels: { confirm: "OK", cancel: t("Cancel") },
        onConfirm: async () => {
          await callApi<unknown, unknown>({
            action: Actions.PUSH_DAILY_MENU,
            params: {
              date: new Date(timestamp),
              targetName,
              shift,
              customerId: customer.id || "",
              quantity: Object.fromEntries(quantity),
            },
          });
          close();
          onReload();
        },
      });
    },
    [timestamp, customer, t, close, targetName, shift, onReload],
  );

  return customer ? (
    <Table.Td
      onClick={open}
      height={150}
      style={{
        cursor: "pointer",
        verticalAlign: "top",
      }}
    >
      <Box fz={16} fw={900} mb={2} w="100%" ta="right">
        {date}
      </Box>
      {Array.from(quantity.keys()).map((productId, idx) => (
        <MenuItem key={idx} product={allProducts.get(productId)} />
      ))}
      <Modal
        opened={opened}
        onClick={stopMouseEvent}
        onClose={close}
        title={title}
        fullScreen
        classNames={{
          title:
            "c-catering-font-900 c-catering-fz-2rem c-catering-text-main",
        }}
      >
        <EditModal
          quantity={quantity}
          allProducts={allProducts}
          onSave={save}
        />
      </Modal>
    </Table.Td>
  ) : (
    <></>
  );
};

export default Cell;
