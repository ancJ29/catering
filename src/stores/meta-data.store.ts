import {
  configs as actionConfigs,
  Actions,
} from "@/auto-generated/api-configs";
import { unitSchema } from "@/auto-generated/prisma-schema";
import logger from "@/services/logger";
import request from "@/services/request";
import { Dictionary } from "@/types";
import { z } from "zod";
import { create } from "zustand";

type OmitUnitType =
  | "clientId"
  | "createdAt"
  | "updatedAt"
  | "lastModifiedBy";
type Unit = Omit<z.infer<typeof unitSchema>, OmitUnitType>;

type MetaDataStore = {
  materialGroupByType: Record<string, string[]>;
  dictionaries: Record<string, Dictionary>;
  kitchenType?: string;
  units: Unit[];
  enumMap: Map<string, string>;
  departmentIdByName: Map<string, string>;
  roleIdByName: Map<string, string>;
  loadMetaData: () => Promise<void>;
};

const { response } = actionConfigs[Actions.GET_METADATA].schema;
type Response = z.infer<typeof response>;

export default create<MetaDataStore>((set) => ({
  materialGroupByType: {},
  dictionaries: JSON.parse(
    localStorage.getItem("____dictionaries____") || "{}",
  ),
  units: [],
  enumMap: new Map<string, string>(),
  departmentIdByName: new Map<string, string>(),
  roleIdByName: new Map<string, string>(),
  loadMetaData: async () => {
    const data: Response = await request({
      action: Actions.GET_METADATA,
    });
    logger.info(
      "loadMetaData",
      typeof data,
      data.dictionaries.version,
    );
    const version = data.dictionaries.version;
    const cachedVersion = localStorage.getItem(
      "____dictionaries-version____",
    );
    if (cachedVersion !== version) {
      localStorage.setItem("____dictionaries-version____", version);
      localStorage.setItem(
        "____dictionaries____",
        JSON.stringify(data.dictionaries),
      );
    }
    set(() => ({
      kitchenType: data.enums.find(
        (e) => e.name === "client-catering",
      )?.id,
      units: data.units,
      enumMap: new Map(data.enums.map((e) => [e.id, e.name])),
      departmentIdByName: new Map(
        data.departments.map((e) => [e.name, e.id]),
      ),
      roleIdByName: new Map(data.roles.map((e) => [e.name, e.id])),
      materialGroupByType: data.materialGroupByType,
      dictionaries: {
        en: data.dictionaries.en,
        vi: data.dictionaries.vi,
      },
    }));
  },
}));
