import { LanguageContext } from "@/contexts/LanguageContext";
import logger from "@/services/logger";
import { useCallback, useContext } from "react";

export default function useTranslation(): (key?: string) => string {
  const { dictionary } = useContext(LanguageContext);
  const t = useCallback(
    (key?: string) => {
      if (!key) {
        return "";
      }
      if (dictionary[key]) {
        return dictionary[key];
      } else {
        logger.warn("Missing translation", key);
        return key;
      }
    },
    [dictionary],
  );
  return t;
}
