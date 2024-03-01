import logger from "@/services/logger";
import { useEffect, useState } from "react";
import { useIsMounted } from "usehooks-ts";

export default function useOnMounted(callback: () => void, key = "") {
  const isMounted = useIsMounted();
  const [counter, setCounter] = useState(0);
  useEffect(() => {
    if (isMounted() && counter < 1) {
      if (key) {
        logger.trace(`useOnMounted: ${key} / ${counter}`);
      }
      setCounter((prev) => prev + 1);
      callback();
    }
  }, [callback, isMounted, key, counter]);
}
