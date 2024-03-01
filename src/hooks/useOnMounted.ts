import logger from "@/services/logger";
import { useEffect } from "react";
import { useIsMounted } from "usehooks-ts";

export default function useOnMounted(callback: () => void, key = "") {
  const isMounted = useIsMounted();
  useEffect(() => {
    if (key) {
      logger.debug(`useOnMounted: ${key}`);
    }
    if (isMounted()) {
      callback();
    }
  }, [callback, isMounted, key]);
}
