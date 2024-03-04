import logger from "@/services/logger";
import { useEffect } from "react";
import { useBoolean, useIsMounted } from "usehooks-ts";

export default function useOnMounted(callback: () => void, key = "") {
  const isMounted = useIsMounted();
  const { value: loaded, setFalse } = useBoolean(false);
  useEffect(() => {
    key && logger.debug(`useOnMounted ${key} ${loaded}`);
    if (isMounted() && !loaded) {
      setFalse();
      callback();
    }
  }, [key, loaded, callback, isMounted, setFalse]);
}
