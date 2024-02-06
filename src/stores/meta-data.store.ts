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
  enumMap: Map<string, string>;
  loadMetaData: () => Promise<void>;
};

export default create<MetaDataStore>((set) => ({
  dictionaries: JSON.parse(
    localStorage.getItem("____dictionaries____") || "{}",
  ),
  roles: [],
  departments: [],
  enumMap: new Map(),
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
      kitchenType: data.enums.find(
        (e) => e.name === "client-catering",
      )?.id,
      enums: data.enums,
      enumMap: new Map(data.enums.map((e) => [e.id, e.name])),
      roles: buildOptions(data.roles),
      departments: buildOptions(data.departments),
      dictionaries: {
        en: data.dictionaries.en,
        vi: data.dictionaries.vi,
      },
    }));
  },
}));
