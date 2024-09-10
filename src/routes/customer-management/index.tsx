import AutocompleteForFilterData from "@/components/c-catering/AutocompleteForFilterData";
import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import { Customer, getAllCustomers } from "@/services/domain";
import { Flex, Stack } from "@mantine/core";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { configs } from "./_configs";

const CustomerManagement = () => {
  const t = useTranslation();
  const navigate = useNavigate();

  const handleProductClick = useCallback(
    (id: string) => {
      navigate(`/customer-management/product/${id}`);
    },
    [navigate],
  );

  const handleTargetAudienceClick = useCallback(
    (id: string) => {
      navigate(`/customer-management/target/${id}`);
    },
    [navigate],
  );

  const dataGridConfigs = useMemo(
    () => configs(t, handleProductClick, handleTargetAudienceClick),
    [t, handleProductClick, handleTargetAudienceClick],
  );

  const { data, names, reload } = useFilterData<Customer>({
    dataLoader: getAllCustomers,
  });

  return (
    <Stack gap={10}>
      <Flex justify="end" align="center">
        <AutocompleteForFilterData
          data={names}
          onReload={reload}
          w={{ base: "50%", sm: "20rem" }}
        />
      </Flex>
      <DataGrid columns={dataGridConfigs} data={data} />
    </Stack>
  );
};

export default CustomerManagement;
