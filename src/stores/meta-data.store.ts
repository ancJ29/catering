import { getMetadata } from "@/services/metadata";
import { Dictionary, OptionProps } from "@/types";
import { buildOptions } from "@/utils/array";
import { create } from "zustand";

type MetaDataStore = {
  roles: OptionProps[];
  dictionaries: Record<string, Dictionary>;
  loadMetaData: () => Promise<void>;
};

export default create<MetaDataStore>((set) => ({
  dictionaries: {},
  roles: [],
  loadMetaData: async () => {
    const data = await getMetadata();
    set(() => ({
      roles: buildOptions(data.roles),
      dictionaries: data.dictionaries,
    }));
  },
}));
