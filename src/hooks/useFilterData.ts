import logger from "@/services/logger";
import { useCallback, useEffect, useState } from "react";
import useOnMounted from "./useOnMounted";

export default function useFilterData<T extends { name: string }>({
  reload,
}: {
  reload?: () => Promise<T[] | undefined> | T[] | undefined;
} = {}) {
  const [records, setRecords] = useState<Map<string, T>>(new Map());
  const [data, setData] = useState<T[]>([]);
  const [names, setNames] = useState([""]);

  useEffect(() => {
    if (!records.size) {
      return;
    }
    setNames(Array.from(records.keys()));
    setData(Array.from(records.values()));
  }, [records]);

  const _load = useCallback(async () => {
    if (records.size) {
      return;
    }
    if (reload) {
      const data = await reload();
      data && setRecords(new Map(data.map((c) => [c.name, c])));
    }
  }, [records.size, reload]);

  useOnMounted(_load);

  const filter = useCallback(
    (keyword: string) => {
      if (!keyword) {
        setData(Array.from(records.values()));
        return;
      }
      const _keyword = keyword.toLowerCase();
      setData(
        Array.from(records.values()).filter((c) =>
          c.name?.toLocaleLowerCase().includes(_keyword),
        ),
      );
    },
    [records],
  );

  const change = useCallback(
    (value: string) => {
      logger.debug("change", value, records.has(value));
      records.has(value) && setData([records.get(value) as T]);
    },
    [records],
  );

  return {
    data,
    names,
    records,
    filter,
    change,
    setRecords,
  };
}
