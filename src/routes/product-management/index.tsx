import Autocomplete from "@/components/common/Autocomplete";
import DataGrid from "@/components/common/DataGrid";
import useTranslation from "@/hooks/useTranslation";
import {
  Product as _Product,
  getAllProducts,
} from "@/services/domain";
import useMetaDataStore from "@/stores/meta-data.store";
import { unique } from "@/utils";
import { Flex, Stack } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { configs } from "./_configs";

type Product = _Product & {
  typeName?: string;
};

const ProductManagement = () => {
  const t = useTranslation();
  const { enumMap } = useMetaDataStore();
  const dataGridConfigs = useMemo(() => configs(t), [t]);
  const [products, setProducts] = useState<Product[]>([]);
  const [data, setData] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [names, setNames] = useState([""]);

  const _reload = useCallback(() => {
    if (products.length > 0) {
      return;
    }
    if (enumMap.size === 0) {
      return;
    }
    getAllProducts().then((products: Product[]) => {
      const _products = products.map((el) => {
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
      setProducts(_products);
      setData(_products);
      setNames(unique(_products.map((el) => el.name as string)));
    });
  }, [enumMap, products.length, t]);

  const filter = useCallback(
    (keyword: string) => {
      setPage(1);
      if (!keyword) {
        setData(products);
        return;
      }
      const _keyword = keyword.toLowerCase();
      setData(
        products.filter((c) =>
          (c.name as string)?.toLocaleLowerCase().includes(_keyword),
        ),
      );
    },
    [products],
  );

  useEffect(() => {
    _reload();
  }, [_reload]);

  return (
    <Stack gap={10}>
      <Flex justify="end" align={"center"}>
        <Autocomplete w={"20vw"} onEnter={filter} data={names} />
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
