import { Actions } from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import callApi from "@/services/api";
import { Customer, Product } from "@/services/domain";
import { stopMouseEvent } from "@/utils";
import { Box, Modal, Table, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import dayjs from "dayjs";
import { useCallback, useMemo } from "react";
import EditModal from "./EditModal";
import MenuItem from "./MenuItem";

type CellProps = {
  targetName: string;
  shift: string;
  date?: string;
  timestamp?: number;
  productIds: string[];
  customer?: Customer;
  allProducts: Map<string, Product>;
  onReload: () => void;
};

const Cell = ({
  targetName,
  allProducts,
  shift,
  date,
  timestamp,
  customer,
  productIds,
  onReload,
}: CellProps) => {
  const t = useTranslation();
  const [opened, { open, close }] = useDisclosure(false);
  const title = useMemo(() => {
    if (!customer) {
      return "";
    }
    const date = dayjs(timestamp).format("YYYY-MM-DD");
    return `${date}: ${customer.name} > ${targetName} > ${shift}`;
  }, [customer, shift, targetName, timestamp]);

  const save = useCallback(
    (productIds: string[]) => {
      if (!timestamp || !customer) {
        close();
        return;
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
              productIds,
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
      {productIds.map((productId, idx) => (
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
          productIds={productIds}
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
