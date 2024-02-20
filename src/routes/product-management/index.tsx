import Autocomplete from "@/components/common/Autocomplete";
import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import { Product, getAllProducts } from "@/services/domain";
import useMetaDataStore from "@/stores/meta-data.store";
import { Flex, Stack } from "@mantine/core";
import { useCallback, useMemo, useState } from "react";
import { configs } from "./_configs";

const ProductManagement = () => {
  const t = useTranslation();
  const { enumMap } = useMetaDataStore();
  const dataGridConfigs = useMemo(() => configs(t), [t]);
  const [loaded, setLoaded] = useState(false);

  const _reload = useCallback(() => {
    if (loaded || enumMap.size === 0) {
      return;
    }
    setLoaded(true);
    return getAllProducts().then((products: Product[]) => {
      return products.map((el) => {
        const type = enumMap.get(el.type as string);
        el.typeName = type ? t(type) : `${type}.s`;
        if (typeof el.name === "string") {
          const strings = el.name.split(".");
          el.name =
            strings.length > 1
              ? strings.slice(0, -1).join(".")
              : strings[0];
        }
        return el;
      });
    });
  }, [enumMap, loaded, t]);

  const { data, names, page, setPage, filter, change } =
    useFilterData<Product>({
      reload: _reload,
    });

  return (
    <Stack gap={10}>
      <Flex justify="end" align={"center"}>
        <Autocomplete
          w={"20vw"}
          onEnter={filter}
          data={names}
          onChange={change}
        />
      </Flex>
      <DataGrid
        page={page}
        limit={10}
        isPaginated
        hasOrderColumn
        columns={dataGridConfigs}
        data={data}
        onChangePage={setPage}
      />
    </Stack>
  );
};

export default ProductManagement;
