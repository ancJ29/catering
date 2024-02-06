import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import DataGrid from "@/components/common/DataGrid";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import callApi from "@/services/api";
import useMetaDataStore from "@/stores/meta-data.store";
import { GenericObject } from "@/types";
import { Stack } from "@mantine/core";
import { useCallback, useMemo, useState } from "react";
import { z } from "zod";
import configs from "./_configs";

const { request, response } =
  actionConfigs[Actions.GET_DEPARTMENTS].schema;
export type Request = z.infer<typeof request>;
export type Response = z.infer<typeof response>;

const CateringManagement = () => {
  const t = useTranslation();
  const { kitchenType } = useMetaDataStore();
  const dataGridConfigs = useMemo(() => configs(t), [t]);
  const [caterings, setCaterings] = useState<GenericObject[]>([]);

  const _reload = useCallback(
    async (noCache?: boolean) => {
      if (!kitchenType) {
        return;
      }
      if (noCache) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
      _loadData(kitchenType, noCache).then((caterings) =>
        setCaterings(caterings || []),
      );
    },
    [kitchenType],
  );

  useOnMounted(_reload);

  return (
    <Stack gap={10} w="100%" h="100%" p={10}>
      <DataGrid
        hasOrderColumn
        columns={dataGridConfigs}
        data={caterings}
      />
    </Stack>
  );
};

async function _loadData(
  kitchenType: string,
  noCache?: boolean,
  cursor?: string,
): Promise<GenericObject[]> {
  const res = await callApi<Request, Response>({
    action: Actions.GET_DEPARTMENTS,
    params: {
      take: 100,
      cursor,
      type: kitchenType,
    },
    options: { noCache },
  });

  if (res?.hasMore) {
    const _users = (res?.departments || []) as GenericObject[];
    return _users.concat(
      await _loadData(kitchenType, noCache, res.cursor),
    );
  }
  return res?.departments || [];
}

export default CateringManagement;
