import { getMetadata } from "@/services/metadata";
import { Dictionary, OptionProps } from "@/types";
import { buildOptions } from "@/utils/array";
import { create } from "zustand";

type MetaDataStore = {
  roles: OptionProps[];
  departments: OptionProps[];
  dictionaries: Record<string, Dictionary>;
  kitchenType?: string;
  enums: { id: string; name: string }[];
  loadMetaData: () => Promise<void>;
};

export default create<MetaDataStore>((set) => ({
  dictionaries: JSON.parse(
    localStorage.getItem("____dictionaries____") || "{}",
  ),
  roles: [],
  departments: [],
  enums: [],
  loadMetaData: async () => {
    const data = await getMetadata();
    if (
      localStorage.getItem("____dictionaries-version____") !==
      data.dictionaries.version
    ) {
      localStorage.setItem(
        "____dictionaries____",
        JSON.stringify(data.dictionaries),
      );
    }
    set(() => ({
      kitchenType: data.enums.find((e) => e.name === "client-kitchen")
        ?.id,
      enums: data.enums,
      roles: buildOptions(data.roles),
      departments: buildOptions(data.departments),
      dictionaries: {
        en: data.dictionaries.en,
        vi: data.dictionaries.vi,
      },
    }));
  },
}));
