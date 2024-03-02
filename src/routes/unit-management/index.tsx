import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import NumberInput from "@/components/common/NumberInput";
import useTranslation from "@/hooks/useTranslation";
import callApi from "@/services/api";
import useMetaDataStore from "@/stores/meta-data.store";
import { cloneDeep } from "@/utils";
import {
  Box,
  Button,
  Flex,
  ScrollArea,
  Stack,
  Table,
  Text,
  TextInput,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconCodeMinus, IconCodePlus } from "@tabler/icons-react";
import cx from "clsx";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { z } from "zod";
import classes from "./UnitManagement.module.scss";

const { request } = actionConfigs[Actions.UPDATE_UNITS].schema;
const x = request.transform((array) => array[0]);
type Request = z.infer<typeof request>;

type Unit = z.infer<typeof x> & {
  id: string;
};

type Column = {
  header: string;
  type: "unit" | "converter";
  idx: number;
  last?: boolean;
};

type X = Dispatch<SetStateAction<Unit[] | undefined>>;

// TODO: refactor this component (ref: src/routes/menu-management/)
const UnitManagement = () => {
  const t = useTranslation();
  // https://ui.mantine.dev/component/table-scroll-area/
  const [scrolled, setScrolled] = useState(false);

  const { units, loadMetaData } = useMetaDataStore();
  const [counter, setCounter] = useState(0);
  const [list, setList] = useState<Unit[] | undefined>();
  const [updated, setUpdated] = useState<Unit[]>();
  const [additionColumn, setAdditionColumn] = useState(0);

  useEffect(() => {
    units.length && setList(cloneDeep(units));
  }, [units]);

  const columns = useMemo(() => {
    return _columns(additionColumn, units, t);
  }, [additionColumn, units, t]);

  const rows = useMemo(() => {
    return _rows(list || [], columns, setList, setUpdated, t);
  }, [columns, list, t]);

  const headers = useMemo(
    () => _headers(columns, setAdditionColumn, t),
    [columns, t],
  );

  const save = useCallback(() => {
    modals.openConfirmModal({
      title: t("Update changes"),
      children: (
        <Text size="sm">{t("Are you sure to save changes?")}</Text>
      ),
      labels: { confirm: "OK", cancel: t("Cancel") },
      onConfirm: () => {
        const _updated = updated?.filter((el) => !!el.name);
        callApi<Request, unknown>({
          action: Actions.UPDATE_UNITS,
          params: updated?.filter((el) => !!el.name),
          options: {
            toastMessage: t("Your changes have been saved"),
          },
        }).then(() => {
          setList(_updated);
          setCounter(counter + 1);
          setUpdated(undefined);
          loadMetaData();
        });
      },
    });
  }, [counter, loadMetaData, t, updated]);

  const reset = useCallback(() => {
    modals.openConfirmModal({
      title: t("Reset changes"),
      children: (
        <Text size="sm">
          {t("Are you sure you want to reset changes?")}
        </Text>
      ),
      labels: { confirm: "OK", cancel: t("Cancel") },
      onConfirm: () => {
        setAdditionColumn(0);
        setList(cloneDeep(units));
        setUpdated(undefined);
        setCounter(counter + 1);
      },
    });
  }, [counter, t, units]);

  const addRow = useCallback(() => {
    const item = {
      id: "",
      name: "",
      units: [],
      converters: [],
    };
    setUpdated((prev) => {
      if (!prev) {
        prev = cloneDeep(list) || [];
      }
      prev.push(item);
      return [...prev];
    });
    setList((prev) => {
      if (!prev) {
        prev = [];
      }
      prev.push(item);
      return [...prev];
    });
  }, [list]);

  return (
    <Stack gap={10}>
      <Box ta="right" pr={10}>
        <Button variant="outline" ml={10} w={100} onClick={addRow}>
          {t("Add")}
        </Button>
        <Button
          variant="light"
          ml={10}
          w={100}
          onClick={reset}
          disabled={!updated}
        >
          {t("Reset")}
        </Button>
        <Button
          color="orange"
          ml={10}
          w={100}
          onClick={save}
          disabled={!updated}
        >
          {t("Save")}
        </Button>
      </Box>
      <ScrollArea
        h="80vh"
        className={classes.container}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <Table key={counter}>
          <Table.Thead
            className={cx(classes.header, {
              [classes.scrolled]: scrolled,
            })}
          >
            {headers}
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </Stack>
  );
};

export default UnitManagement;

function _headers(
  columns: Column[],
  setAdditionColumn: Dispatch<SetStateAction<number>>,
  t: (_: string) => string,
) {
  return (
    <Table.Tr>
      <Table.Th>#</Table.Th>
      <Table.Th>{t("Unit")}</Table.Th>
      {columns.map(({ header, last }, idx) => (
        <Table.Th key={idx}>
          <Flex justify="space-between" align="center" pr={10}>
            {header}
            {last && (
              <Flex>
                <UnstyledButton
                  className="c-catering-flex-align-center"
                  onClick={() => setAdditionColumn((c) => c + 1)}
                >
                  <Tooltip label={t("Add column")}>
                    <IconCodePlus size={20} />
                  </Tooltip>
                </UnstyledButton>
                <UnstyledButton
                  className="c-catering-flex-align-center"
                  onClick={() => setAdditionColumn((c) => c - 1)}
                >
                  <Tooltip label={t("Remove column")}>
                    <IconCodeMinus size={20} />
                  </Tooltip>
                </UnstyledButton>
              </Flex>
            )}
          </Flex>
        </Table.Th>
      ))}
      <Table.Th></Table.Th>
    </Table.Tr>
  );
}

function _rows(
  list: Unit[],
  columns: Column[],
  setList: X,
  setUpdated: X,
  t: (_: string) => string,
) {
  function _updated(
    idx: number,
    kdx: number,
    key: "name" | "units" | "converters",
    value: string | number,
  ) {
    setUpdated((prev) => {
      if (!prev) {
        prev = cloneDeep(list);
      }
      if (key === "name") {
        prev[idx].name = value.toString();
      }
      if (key === "units") {
        prev[idx].units[kdx - 1] = value.toString();
      }
      if (key === "converters") {
        prev[idx].converters[kdx - 2] = parseInt(value.toString());
      }
      return [...prev];
    });
  }
  return list.map((element, idx) => (
    <Table.Tr key={element.name} className={classes.row}>
      <Table.Td>{idx + 1}</Table.Td>
      <Table.Td>
        <TextInput
          defaultValue={element.name}
          onChange={(e) => {
            _updated(idx, 0, "name", e.target.value);
          }}
        />
      </Table.Td>
      {columns.map(({ type, idx: kdx }, jdx) => (
        <Table.Td key={jdx}>
          {type === "unit" ? (
            <TextInput
              defaultValue={element.units[kdx - 1]}
              onChange={(e) => {
                _updated(idx, kdx, "units", e.target.value);
              }}
            />
          ) : (
            <NumberInput
              defaultValue={element.converters[kdx - 2]}
              onChange={(value) => {
                _updated(idx, kdx, "converters", value);
              }}
            />
          )}
        </Table.Td>
      ))}
      <Table.Td>
        <Button
          size="compact-xs"
          variant="light"
          color="error"
          ml={10}
          w={100}
          onClick={() => {
            setList((prev) => {
              if (!prev) {
                prev = [];
              }
              prev.splice(idx, 1);
              return [...prev];
            });
            setUpdated((prev) => {
              if (!prev) {
                prev = cloneDeep(list);
              }
              prev.splice(idx, 1);
              return [...prev];
            });
          }}
        >
          {t("Remove")}
        </Button>
      </Table.Td>
    </Table.Tr>
  ));
}
function _columns(
  additionColumn: number,
  units: {
    name: string;
    units: string[];
    converters: number[];
  }[],
  t: (_: string) => string,
): Column[] {
  const total =
    2 * additionColumn +
    -1 +
    2 * Math.max(...units.map((element) => element.units.length), 0);
  return Array.from({ length: total }, (_, idx) => {
    const number = 1 + Math.floor((1 + idx) / 2);
    if (idx % 2 === 0) {
      return {
        header: `${t("Unit")} ${number}`,
        type: "unit",
        idx: number,
        last: idx === total - 1,
      };
    }
    return {
      header: `${t("Converter")} ${number - 1}→${number}`,
      type: "converter",
      idx: number,
    };
  });
}
