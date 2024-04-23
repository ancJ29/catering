import { dictionaryList } from "@/services/i18n";
import useMetaDataStore from "@/stores/meta-data.store";
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

interface LanguageProviderProps {
  children: ReactNode;
}

export interface LanguageContextType {
  language: string;
  dictionary: Record<string, string>;
  onChangeLanguage?: (selected: string) => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: localStorage.getItem("language") || "vi",
  dictionary: dictionaryList.vi,
});

export function LanguageProvider({
  children,
}: LanguageProviderProps) {
  const [language, setLanguage] = useState("vi");
  const { dictionaries } = useMetaDataStore();

  useEffect(() => {
    const language = localStorage.getItem("language") || "vi";
    if (language in dictionaryList) {
      setLanguage(language);
    }
  }, []);

  const onChangeLanguage = useCallback((selected: string) => {
    if (selected in dictionaryList) {
      localStorage.setItem("language", selected);
      setLanguage(selected);
    }
  }, []);

  const provider: LanguageContextType = useMemo(() => {
    return {
      language,
      dictionary: {
        ...dictionaryList[language],
        ...dictionaries[language],
      },
      onChangeLanguage,
    };
  }, [dictionaries, language, onChangeLanguage]);

  return (
    <LanguageContext.Provider value={provider}>
      {children}
    </LanguageContext.Provider>
  );
}
