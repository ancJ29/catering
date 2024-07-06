import {
  configs as actionConfigs,
  Actions,
} from "@/auto-generated/api-configs";
import { unitSchema } from "@/auto-generated/prisma-schema";
import logger from "@/services/logger";
import request from "@/services/request";
import useAuthStore from "@/stores/auth.store";
import { Dictionary } from "@/types";
import { buildMap } from "@/utils";
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
  departmentIdByName: Map<string, string>;
  departmentNameById: Map<string, string>;
  roleIdByName: Map<string, string>;
  loadMetaData: () => Promise<void>;
};

const { response } = actionConfigs[Actions.GET_METADATA].schema;
type Response = z.infer<typeof response>;

const emptyMap = new Map<string, string>();

export default create<MetaDataStore>((set) => ({
  units: [],
  materialGroupByType: {},
  dictionaries: JSON.parse(localStorage.__DICTIONARIES__ || "{}"),
  productNameById: emptyMap,
  productIdByName: emptyMap,
  materialNameById: emptyMap,
  materialIdByName: emptyMap,
  departmentIdByName: emptyMap,
  departmentNameById: emptyMap,
  roleIdByName: emptyMap,
  loadMetaData: async () => {
    const { removeToken } = useAuthStore.getState();
    if (await _checkVersion()) {
      set(() => _convert(JSON.parse(localStorage.__META_DATA__)));
      return;
    }
    removeToken();
    const DEBUG_MODE = localStorage.getItem("__DEBUG_MODE");
    localStorage.clear();
    localStorage.__DEBUG_MODE = DEBUG_MODE;
    const data: Response = await request({
      action: Actions.GET_METADATA,
    });
    localStorage.__VERSION__ = data.version;
    localStorage.__META_DATA__ = JSON.stringify(data);
    logger.trace("meta data loaded:", data.dictionaries.version);
    _syncDictionaries(data);
    set(() => _convert(data));
    window.location.reload();
  },
}));

function _convert(data: Response) {
  return {
    units: data.units,
    departmentIdByName: buildMap(data.departments, "name", "id"),
    departmentNameById: buildMap(data.departments),
    roleIdByName: buildMap(data.roles, "name", "id"),
    materialGroupByType: data.materialGroupByType,
    productNameById: new Map(data.products as [string, string][]),
    productIdByName: new Map(
      data.products.map((el) => el.reverse()) as [string, string][],
    ),
    materialNameById: new Map(data.materials as [string, string][]),
    materialIdByName: new Map(
      data.materials.map((el) => el.reverse()) as [string, string][],
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
  return (
    extractMajorVersion(data.version) ===
    extractMajorVersion(currentVersion)
  );
}

function extractMajorVersion(value?: string) {
  return value?.split(".").slice(0, 3).join(".");
}
