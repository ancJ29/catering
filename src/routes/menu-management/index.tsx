import { Actions } from "@/auto-generated/api-configs";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import callApi from "@/services/api";
import {
  DailyMenuStatus,
  dailyMenuKey,
  getDailyMenu,
} from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import useCustomerStore from "@/stores/customer.store";
import useDailyMenuStore from "@/stores/daily-menu.store";
import useProductStore from "@/stores/product.store";
import {
  ONE_WEEK,
  addHashToUrl,
  formatTime,
  removeHashFromUrl,
  stopMouseEvent,
} from "@/utils";
import { Stack, Table, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import {
  customerId,
  defaultCondition,
  hash,
  headersAndRows,
  isWeekView,
  parseHash,
  reducer,
} from "./_configs";
import BlankTableBody from "./components/BlankTableBody";
import ControlBar from "./components/ControllBar";
import ModalTitle from "./components/ModalTitle";
import MonthView from "./components/MonthView";
import WeekView from "./components/WeekView";
import EditModal from "./modal";

const MenuManagement = () => {
  const t = useTranslation();
  const { hash: locationHash } = useLocation();
  const [condition, dispatch] = useReducer(reducer, defaultCondition);
  const { reload: loadAllProducts } = useProductStore();
  const { dailyMenu, push: pushDailyMenu } = useDailyMenuStore();
  const {
    idByName: customerIdByName,
    customers,
    reload: loadAllCustomers,
  } = useCustomerStore();
  const { caterings, reload: loadAllCaterings } = useCateringStore();

  const load = useCallback(() => {
    loadAllProducts();
    loadAllCustomers();
    loadAllCaterings();
  }, [loadAllCaterings, loadAllCustomers, loadAllProducts]);

  useOnMounted(load);

  const _getDailyMenu = useCallback(
    (noCache = false) => {
      const customerId = condition.customer?.id;
      if (!customerId) {
        return;
      }
      getDailyMenu({
        noCache,
        customerId,
        from: condition.markDate - 4 * ONE_WEEK,
        to: condition.markDate + 4 * ONE_WEEK,
      }).then(pushDailyMenu);
    },
    [condition.markDate, condition.customer?.id, pushDailyMenu],
  );

  const openModal = useCallback(
    (shift: string, timestamp: number) => {
      const selectedCustomer = condition.customer;
      const targetName = condition.target?.name || "";
      if (!targetName || !selectedCustomer) {
        return;
      }
      const key = dailyMenuKey(
        selectedCustomer?.id || "",
        condition.target?.name || "",
        shift,
        timestamp,
      );
      const date = formatTime(timestamp, "YYYY-MM-DD");
      const cateringId = selectedCustomer.others.cateringId;
      const catering = caterings.get(cateringId || "");
      const cateringName = catering?.name || "";
      const title = `${date}: ${selectedCustomer.name} > ${targetName} > ${shift} (${cateringName})`;
      const save = (
        status: DailyMenuStatus,
        quantity: Record<string, number>,
      ) => {
        Object.keys(quantity).forEach((productId) => {
          if (quantity[productId] < 1) {
            delete quantity[productId];
          }
        });

        if (
          !timestamp ||
          !selectedCustomer ||
          !Object.keys(quantity).length
        ) {
          modals.closeAll();
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
                targetName: condition.target?.name || "",
                shift,
                status,
                customerId: selectedCustomer.id || "",
                quantity,
              },
            });
            await _getDailyMenu(true);
            modals.closeAll();
          },
        });
      };
      modals.open({
        title: <ModalTitle title={title} />,
        fullScreen: true,
        onClick: stopMouseEvent,
        onClose: modals.closeAll,
        children: (
          <EditModal
            cateringId={condition.cateringId || ""}
            key={Date.now()}
            dailyMenu={dailyMenu.get(key)}
            onSave={save}
          />
        ),
      });
    },
    [_getDailyMenu, caterings, condition, dailyMenu, t],
  );

  const { rows, headers } = useMemo(() => {
    return headersAndRows(condition.mode, condition.markDate, t);
  }, [condition.markDate, condition.mode, t]);

  useEffect(_getDailyMenu, [_getDailyMenu]);

  // For hash change
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded && customers.size) {
      setLoaded(true);
      dispatch({
        type: "OVERRIDE",
        overrideState: parseHash(
          locationHash,
          customerIdByName,
          customers,
        ),
      });
    }
  }, [customerIdByName, customers, locationHash, loaded]);

  useEffect(() => {
    if (loaded) {
      const _hash = hash(condition);
      _hash ? addHashToUrl(_hash) : removeHashFromUrl();
    }
  }, [loaded, condition]);

  return (
    <Stack gap={10}>
      <ControlBar
        mode={condition.mode}
        shift={condition.shift || ""}
        customer={condition.customer}
        cateringId={condition.cateringId}
        shifts={condition.target?.shifts || []}
        targetName={condition.target?.name || ""}
        onClear={() =>
          dispatch({
            type: "CLEAR",
            keys: ["target", "shift", "customer", "cateringId"],
          })
        }
        onChangeCateringId={(cateringId) =>
          dispatch({
            type: "UPDATE_CATERING_ID",
            cateringId,
          })
        }
        onCustomerChange={(customer) =>
          dispatch({ type: "UPDATE_CUSTOMER", customer })
        }
        onChangeMode={(mode: "W" | "M") =>
          dispatch({ type: "OVERRIDE", overrideState: { mode } })
        }
        setShift={(shift) => {
          dispatch({
            type: "OVERRIDE",
            overrideState: { shift },
          });
        }}
        onShiftMarkDate={(diff: 1 | -1) => {
          dispatch({
            type: "SHIFT_MARK_DATE",
            shift: diff,
          });
        }}
        onTargetChange={(target: {
          name: string;
          shifts: string[];
        }) => {
          dispatch({
            type: "OVERRIDE",
            overrideState: {
              target,
              shift: target.shifts[0] || "",
            },
          });
        }}
      />
      <Table withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            {condition.mode === "W" && (
              <Table.Th w={60}>&nbsp;</Table.Th>
            )}
            {headers.map((el, idx) => {
              return (
                <Table.Th ta="center" key={idx} w="14.2857%">
                  {el.label}
                </Table.Th>
              );
            })}
          </Table.Tr>
        </Table.Thead>

        {customerId(condition) ? (
          isWeekView(condition.mode) ? (
            <WeekView
              headers={headers || []}
              shifts={condition.target?.shifts || []}
              customer={condition.customer}
              targetName={condition.target?.name || ""}
              onClick={openModal}
            />
          ) : (
            <MonthView
              rows={rows}
              customer={condition.customer}
              shift={condition.shift || ""}
              targetName={condition.target?.name || ""}
              onClick={openModal}
            />
          )
        ) : (
          <BlankTableBody mode={condition.mode} />
        )}
      </Table>
    </Stack>
  );
};

export default MenuManagement;
