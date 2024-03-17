import loading from "@/services/api/store/loading";
import { useCallback } from "react";

export default function useLoading() {
  const toggle = useCallback((delay?: number) => {
    loading.toggleLoading(delay);
  }, []);
  return toggle;
}
