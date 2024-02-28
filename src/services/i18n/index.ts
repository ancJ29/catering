import en from "@/auto-generated/api-configs/translation/en";
import vi from "@/auto-generated/api-configs/translation/vi";
import { Dictionary } from "@/types";

export const dictionaryList: Record<string, Dictionary> = {
  en,
  vi,
};

export const languageOptions = {
  en: "English",
  /* cspell:disable-next-line */
  vi: "Tiếng Việt",
};
