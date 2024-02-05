import { useEffect, useState } from "react";

export default function useAxiosLoading() {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const _start = () => setLoading(true);
    const _clear = () => setLoading(false);
    window.addEventListener("start-loading", _start);
    window.addEventListener("clear-loading", _clear);
    return () => {
      window.removeEventListener("start-loading", _start);
      window.removeEventListener("clear-loading", _clear);
    };
  }, []);
  return loading;
}
