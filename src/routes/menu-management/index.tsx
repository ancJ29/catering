import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import useCustomerStore from "@/stores/customer.store";
import { startOfDay } from "@/utils";
import { ScrollArea, Stack, Table } from "@mantine/core";
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import classes from "./ScrollArea.module.scss";
import { ActionType, defaultCondition, reducer } from "./_configs";
import {
  _customerId,
  _getDailyMenu,
  _hash,
  _headersAndRows,
  _isWeekView,
  _parseHash,
  _reload,
  _updateHash,
  _url,
} from "./_helpers";
import Alert from "./components/Alert";
import BlankTableBody from "./components/BlankTableBody";
import ControlBar from "./components/ControllBar";
import MonthView from "./components/MonthView";
import WeekView from "./components/WeekView";

const MenuManagement = () => {
  const navigate = useNavigate();
  const t = useTranslation();
  const [loaded, setLoaded] = useState(false);
  const { hash: locationHash } = useLocation();
  const [condition, dispatch] = useReducer(reducer, defaultCondition);
  // prettier-ignore
  const { idByName: customerIdByName, customers } = useCustomerStore();

  // prettier-ignore
  const onOpen = useCallback((shift: string, timestamp: number) => navigate(_url(
    condition.customer?.name,
    condition.target?.name,
    shift,
    timestamp,
  )), [condition.customer?.name, condition.target?.name, navigate]);

  const { rows, headers } = useMemo(() => {
    return _headersAndRows(condition.mode, condition.markDate, t);
  }, [condition.markDate, condition.mode, t]);

  useOnMounted(_reload);

  useEffect(() => {
    _getDailyMenu(condition.customer?.id || "", condition.markDate);
  }, [condition.customer?.id, condition.markDate]);

  useEffect(() => {
    loaded && _updateHash(_hash(condition));
  }, [loaded, condition]);

  useEffect(() => {
    if (!loaded && customers.size) {
      setLoaded(true);
      dispatch({
        type: ActionType.OVERRIDE,
        overrideState: _parseHash(
          locationHash,
          customerIdByName,
          customers,
        ),
      });
    }
  }, [customerIdByName, customers, locationHash, loaded]);

  return (
    <Stack gap={10}>
      <ControlBar
        mode={condition.mode}
        shift={condition.shift || ""}
        customer={condition.customer}
        cateringId={condition.cateringId}
        shifts={condition.target?.shifts || []}
        targetName={condition.target?.name || ""}
        onResetDate={() =>
          dispatch({
            type: ActionType.OVERRIDE,
            overrideState: { markDate: startOfDay(Date.now()) },
          })
        }
        onClear={() =>
          dispatch({
            type: ActionType.CLEAR,
            keys: ["target", "shift", "customer", "cateringId"],
          })
        }
        onChangeCateringId={(cateringId) =>
          dispatch({
            type: ActionType.UPDATE_CATERING_ID,
            cateringId,
          })
        }
        onCustomerChange={(customer) =>
          dispatch({ type: ActionType.UPDATE_CUSTOMER, customer })
        }
        onChangeMode={(mode: "W" | "M") =>
          dispatch({
            type: ActionType.OVERRIDE,
            overrideState: { mode },
          })
        }
        setShift={(shift) =>
          dispatch({
            type: ActionType.OVERRIDE,
            overrideState: { shift },
          })
        }
        onShiftMarkDate={(diff: 1 | -1) =>
          dispatch({
            type: ActionType.SHIFT_MARK_DATE,
            shift: diff,
          })
        }
        onTargetChange={(target: {
          name: string;
          shifts: string[];
        }) =>
          dispatch({
            type: ActionType.OVERRIDE,
            overrideState: {
              target,
              shift: target.shifts[0] || "",
            },
          })
        }
      />
      <Alert />
      <ScrollArea h={"calc(100vh - 10rem)"}>
        <Table withColumnBorders m={0} className={classes.table}>
          <Table.Thead className={classes.header}>
            <Table.Tr bg="white">
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

          {_customerId(condition) ? (
            _isWeekView(condition.mode) ? (
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
      </ScrollArea>
    </Stack>
  );
};

export default MenuManagement;
