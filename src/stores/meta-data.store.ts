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
  units: Unit[];
  productNameById: Map<string, string>;
  productIdByName: Map<string, string>;
  materialNameById: Map<string, string>;
  materialIdByName: Map<string, string>;
  enumMap: Map<string, string>;
  departmentIdByName: Map<string, string>;
  roleIdByName: Map<string, string>;
  loadMetaData: () => Promise<void>;
};

const { response } = actionConfigs[Actions.GET_METADATA].schema;
type Response = z.infer<typeof response>;

export default create<MetaDataStore>((set) => ({
  units: [],
  materialGroupByType: {},
  dictionaries: JSON.parse(localStorage.__DICTIONARIES__ || "{}"),
  productNameById: new Map<string, string>(),
  productIdByName: new Map<string, string>(),
  materialNameById: new Map<string, string>(),
  materialIdByName: new Map<string, string>(),
  enumMap: new Map<string, string>(),
  departmentIdByName: new Map<string, string>(),
  roleIdByName: new Map<string, string>(),
  loadMetaData: async () => {
    if (await _checkVersion()) {
      set(() => _convert(JSON.parse(localStorage.__META_DATA__)));
      return;
    }
    const data: Response = await request({
      action: Actions.GET_METADATA,
    });
    localStorage.__VERSION__ = data.version;
    localStorage.__META_DATA__ = JSON.stringify(data);
    logger.trace("meta data loaded:", data.dictionaries.version);
    _syncDictionaries(data);
    set(() => _convert(data));
  },
}));

function _convert(data: Response) {
  return {
    units: data.units,
    enumMap: new Map(data.enums.map((e) => [e.id, e.name])),
    departmentIdByName: new Map(
      data.departments.map((e) => [e.name, e.id]),
    ),
    roleIdByName: new Map(data.roles.map((e) => [e.name, e.id])),
    materialGroupByType: data.materialGroupByType,
    productNameById: new Map(data.products.map((p) => [p[0], p[1]])),
    productIdByName: new Map(data.products.map((p) => [p[1], p[0]])),
    materialNameById: new Map(
      data.materials.map((m) => [m[0], m[1]]),
    ),
    materialIdByName: new Map(
      data.materials.map((m) => [m[1], m[0]]),
    ),
    dictionaries: {
      en: data.dictionaries.en,
      vi: data.dictionaries.vi,
    },
  };
}

function _syncDictionaries(data: Response) {
  const version = data.dictionaries.version;
  const cachedVersion = localStorage.____DICTIONARIES_VERSION____;
  if (cachedVersion !== version) {
    localStorage.____DICTIONARIES_VERSION____ = version;
    localStorage.__DICTIONARIES__ = JSON.stringify(data.dictionaries);
  }
}

async function _checkVersion() {
  const currentVersion = localStorage.__VERSION__;
  const data: { version: string } = await request({
    action: Actions.GET_VERSION,
  });
  logger.debug("version check:", data.version, currentVersion);
  return data.version === currentVersion;
}
