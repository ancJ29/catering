import { useEffect, useState } from "react";

export default function useWatchProp<T>(
  prop: T,
  callback: () => void,
) {
  const [_prop, setProp] = useState(prop);
  useEffect(() => {
    if (prop === _prop) {
      return;
    }
    setProp(prop);
    callback();
  }, [_prop, callback, prop]);
}
