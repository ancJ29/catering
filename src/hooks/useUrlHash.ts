import { GenericObject } from "@/types";
import { toCondition, toHash } from "@/utils";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function useUrlHash<T extends GenericObject>(
  condition: T,
  callback: (condition: T) => void,
) {
  const [loaded, setLoaded] = useState(false);
  const { hash: locationHash } = useLocation();

  useEffect(() => {
    loaded && toHash(condition);
  }, [loaded, condition]);

  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      callback(toCondition(locationHash));
    }
  }, [locationHash, loaded, callback]);
}
