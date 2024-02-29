import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import { getDailyMenu } from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import useCustomerStore from "@/stores/customer.store";
import useDailyMenuStore from "@/stores/daily-menu.store";
import useProductStore from "@/stores/product.store";
import {
  ONE_WEEK,
  addHashToUrl,
  removeHashFromUrl,
  startOfDay,
} from "@/utils";
import { Stack, Table } from "@mantine/core";
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  customerId,
  defaultCondition,
  hash,
  headersAndRows,
  isWeekView,
  parseHash,
  reducer,
} from "./_configs";
import Alert from "./components/Alert";
import BlankTableBody from "./components/BlankTableBody";
import ControlBar from "./components/ControllBar";
import MonthView from "./components/MonthView";
import WeekView from "./components/WeekView";

const MenuManagement = () => {
  const navigate = useNavigate();
  const t = useTranslation();
  const { hash: locationHash } = useLocation();
  const [condition, dispatch] = useReducer(reducer, defaultCondition);
  const { products, reload: loadAllProducts } = useProductStore();
  const { push: pushDailyMenu, loadTodayMenu } = useDailyMenuStore();
  const {
    idByName: customerIdByName,
    customers,
    reload: loadAllCustomers,
  } = useCustomerStore();
  const { caterings, reload: loadAllCaterings } = useCateringStore();

  const load = useCallback(() => {
    loadTodayMenu();
    loadAllProducts();
    loadAllCustomers();
    loadAllCaterings();
  }, [
    loadTodayMenu,
    loadAllCaterings,
    loadAllCustomers,
    loadAllProducts,
  ]);

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

  const onOpen = useCallback(
    (shift: string, timestamp: number) => {
      const selectedCustomer = condition.customer;
      const targetName = condition.target?.name || "";
      if (!targetName || !selectedCustomer) {
        return;
      }
      navigate(
        `/menu-management/${selectedCustomer.id}/${encodeURIComponent(
          targetName,
        )}/${encodeURIComponent(shift)}/${timestamp}`,
      );
    },
    [condition, navigate],
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
    <Stack
      gap={10}
      key={`${customers.size}.${caterings.size}.${products.size}`}
    >
      <ControlBar
        onResetDate={() =>
          dispatch({
            type: "OVERRIDE",
            overrideState: { markDate: startOfDay(Date.now()) },
          })
        }
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
        setShift={(shift) =>
          dispatch({
            type: "OVERRIDE",
            overrideState: { shift },
          })
        }
        onShiftMarkDate={(diff: 1 | -1) =>
          dispatch({
            type: "SHIFT_MARK_DATE",
            shift: diff,
          })
        }
        onTargetChange={(target: {
          name: string;
          shifts: string[];
        }) =>
          dispatch({
            type: "OVERRIDE",
            overrideState: {
              target,
              shift: target.shifts[0] || "",
            },
          })
        }
      />
      <Alert />
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
              key={`w.${Date.now()}`}
              headers={headers || []}
              shifts={condition.target?.shifts || []}
              customer={condition.customer}
              targetName={condition.target?.name || ""}
              onClick={onOpen}
            />
          ) : (
            <MonthView
              key={`m.${Date.now()}`}
              rows={rows}
              customer={condition.customer}
              shift={condition.shift || ""}
              targetName={condition.target?.name || ""}
              onClick={onOpen}
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
