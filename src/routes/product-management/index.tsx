import Autocomplete from "@/components/common/Autocomplete";
import DataGrid from "@/components/common/DataGrid";
import Select from "@/components/common/Select";
import useFilterData from "@/hooks/useFilterData";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import { Product } from "@/services/domain";
import userProductStore from "@/stores/product.store";
import { OptionProps } from "@/types";
import { unique } from "@/utils";
import { Button, Flex, Stack, Switch } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useCallback, useMemo, useState } from "react";
import { configs } from "./_configs";

const ProductManagement = () => {
  const t = useTranslation();
  const dataGridConfigs = useMemo(() => configs(t), [t]);
  const { products, reload: reloadProducts } = userProductStore();
  const [type, setType] = useState<string>("");
  const [onSaleOnly, { toggle }] = useDisclosure(false);

  const typeOptions: OptionProps[] = useMemo(() => {
    return unique(
      Array.from(products.values()).map((p) => p.others.type),
    ).map((type) => ({
      value: type,
      label: t(`products.type.${type}`),
    }));
  }, [products, t]);

  useOnMounted(reloadProducts);

  const reload = useCallback(() => {
    return Array.from(products.values());
  }, [products]);

  const {
    data: _data,
    page,
    counter,
    records,
    setPage,
    filter,
    change,
    clear: _clear,
  } = useFilterData<Product>({ reload });

  const [data, names] = useMemo(() => {
    setPage(1);
    const data = _data.filter((p) => {
      if (type && p.others.type !== type) {
        return false;
      }
      if (onSaleOnly && !p.enabled) {
        return false;
      }
      return true;
    });
    const names = Array.from(records.values())
      .filter((p) => {
        if (type && p.others.type !== type) {
          return false;
        }
        if (onSaleOnly && !p.enabled) {
          return false;
        }
        return true;
      })
      .map((c) => c.name);
    return [data, names];
  }, [setPage, _data, records, type, onSaleOnly]);

  const clear = useCallback(() => {
    setType("");
    _clear();
  }, [_clear]);

  const onChangeType = useCallback(
    (value: string | null) => {
      if (value && value !== type) {
        setType(value);
      } else {
        setType("");
      }
    },
    [type],
  );

  return (
    <Stack gap={10}>
      <Flex justify="space-between" align="center">
        <Switch
          mt={20}
          checked={onSaleOnly}
          onChange={toggle}
          label={t("On sale ONLY")}
        />
        <Flex justify="end" align={"end"} gap={10} key={counter}>
          <Select
            value={type || ""}
            label={t("Product type")}
            w={"20vw"}
            options={typeOptions}
            onChange={onChangeType}
          />
          <Autocomplete
            label={t("Cuisine name")}
            w={"20vw"}
            onEnter={filter}
            data={names}
            onChange={change}
          />
          <Button onClick={clear}>{t("Clear")}</Button>
        </Flex>
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
