import ScrollTable from "@/components/c-catering/ScrollTable";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import useUrlHash from "@/hooks/useUrlHash";
import logger from "@/services/logger";
import { exportToMenuExcel, sortShifts, startOfDay } from "@/utils";
import { Stack, Table } from "@mantine/core";
import { useCallback, useEffect, useMemo, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import {
  ActionType,
  FilterType,
  defaultCondition,
  reducer,
} from "./_configs";
import {
  _customerId,
  _getDailyMenu,
  _headersAndRows,
  _isWeekView,
  _reload,
  _url,
} from "./_helpers";
import Alert from "./components/Alert";
import BlankTableBody from "./components/BlankTableBody";
import ControlBar from "./components/ControlBar";
import MonthView from "./components/MonthView";
import WeekView from "./components/WeekView";

const MenuManagement = () => {
  const navigate = useNavigate();
  const t = useTranslation();
  const [condition, dispatch] = useReducer(reducer, defaultCondition);

  const callback = useCallback((condition: FilterType) => {
    dispatch({
      type: ActionType.OVERRIDE,
      overrideState: condition,
    });
  }, []);

  useUrlHash(condition, callback);

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

  const shiftData = useMemo(() => {
    const data = condition.customer?.others.targets?.filter(
      (e) => e.name === condition.target?.name,
    );
    const shifts = data?.flatMap((e) => e.shift) || [];
    return sortShifts(shifts);
  }, [condition.customer?.others.targets, condition.target?.name]);

  const handleExportMenu = () => {
    logger.info("handleExportMenu");
    exportToMenuExcel({
      data: [],
      targetName: "1",
      customerName: "AAA",
      headers,
    });
  };

  const handleExportProductionOrders = () => {
    logger.info("handleExportProductionOrders");
  };

  return (
    <Stack gap={10}>
      <ControlBar
        mode={condition.mode}
        shift={condition.shift || ""}
        customer={condition.customer}
        cateringId={condition.cateringId}
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
        onChangeShift={(shift) =>
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
        onTargetChange={(target) =>
          dispatch({
            type: ActionType.OVERRIDE,
            overrideState: {
              target,
              // shift: target.shifts[0] || "",
            },
          })
        }
        onExportMenu={handleExportMenu}
        onExportProductionOrders={handleExportProductionOrders}
      />
      <Alert />
      <ScrollTable
        withColumnBorders
        h={"calc(100vh - 10rem)"}
        header={
          <>
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
          </>
        }
      >
        {_customerId(condition) ? (
          _isWeekView(condition.mode) ? (
            <WeekView
              // key={`w.${Date.now()}`}
              headers={headers || []}
              shifts={shiftData || []}
              customer={condition.customer}
              targetName={condition.target?.name || ""}
              onClick={onOpen}
            />
          ) : (
            <MonthView
              // key={`m.${Date.now()}`}
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
      </ScrollTable>
    </Stack>
  );
};

export default MenuManagement;
