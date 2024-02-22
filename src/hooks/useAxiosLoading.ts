import logger from "@/services/logger";
import { useEffect, useState } from "react";

export default function useAxiosLoading() {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const _start = () =>
      setLoading((v) => {
        if (v) {
          return true;
        }
        logger.trace("start-loading");
        return true;
      });
    const _clear = () =>
      setLoading((v) => {
        if (!v) {
          return false;
        }
        logger.trace("clear-loading");
        return false;
      });
    window.addEventListener("start-loading", _start);
    window.addEventListener("clear-loading", _clear);
    return () => {
      window.removeEventListener("start-loading", _start);
      window.removeEventListener("clear-loading", _clear);
    };
  }, []);
  return loading;
}
