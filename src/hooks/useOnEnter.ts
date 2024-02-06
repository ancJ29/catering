import { useCallback } from "react";

export default function useOnEnter(callback: () => void) {
  const onEnter = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        callback && callback();
      }
    },
    [callback],
  );
  return onEnter;
}
