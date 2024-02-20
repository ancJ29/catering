import logger from "@/services/logger";
import { useCallback, useEffect, useState } from "react";
import useOnMounted from "./useOnMounted";

export default function useFilterData<T extends { name: string }>({
  reload,
}: {
  reload?: () => Promise<T[] | undefined> | T[] | undefined;
} = {}) {
  const [counter, setCounter] = useState(1);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
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
    (keyword: string, targets?: T[]) => {
      setKeyword(keyword);
      const _targets = targets || Array.from(records.values());
      const _keyword = keyword ? keyword.toLowerCase() : "";
      setData(
        _targets.filter((c) => {
          if (!keyword) {
            return true;
          }
          return c.name.toLowerCase().includes(_keyword);
        }),
      );
      setPage(1);
    },
    [records],
  );

  const change = useCallback(
    (value: string) => {
      logger.debug("change", value, records.has(value));
      if (records.has(value)) {
        records.has(value) && filter(value);
      }
    },
    [filter, records],
  );

  const clear = useCallback(() => {
    setData(Array.from(records.values()));
    setPage(1);
    setCounter((c) => c + 1);
  }, [records]);

  return {
    keyword,
    counter,
    page,
    data,
    names,
    records,
    filter,
    change,
    clear,
    setRecords,
    setPage,
  };
}
