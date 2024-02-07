import { getMetadata } from "@/services/metadata";
import { Dictionary } from "@/types";
import { create } from "zustand";

type MetaDataStore = {
  dictionaries: Record<string, Dictionary>;
  kitchenType?: string;
  enumMap: Map<string, string>;
  departmentIdByName: Map<string, string>;
  roleIdByName: Map<string, string>;
  loadMetaData: () => Promise<void>;
};

export default create<MetaDataStore>((set) => ({
  dictionaries: JSON.parse(
    localStorage.getItem("____dictionaries____") || "{}",
  ),
  enumMap: new Map<string, string>(),
  departmentIdByName: new Map<string, string>(),
  roleIdByName: new Map<string, string>(),
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
      enumMap: new Map(data.enums.map((e) => [e.id, e.name])),
      departmentIdByName: new Map(
        data.departments.map((e) => [e.name, e.id]),
      ),
      roleIdByName: new Map(data.roles.map((e) => [e.name, e.id])),
      dictionaries: {
        en: data.dictionaries.en,
        vi: data.dictionaries.vi,
      },
    }));
  },
}));
