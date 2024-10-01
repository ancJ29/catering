import AddButton from "@/components/c-catering/AddButton";
import AutocompleteForFilterData from "@/components/c-catering/AutocompleteForFilterData";
import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import { Customer, getAllCustomers } from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import { Flex, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { configs } from "./_configs";
import AddCustomerForm from "./components/AddCustomerForm";
import UpdateCustomerForm from "./components/UpdateCustomerForm";

const CustomerManagement = () => {
  const t = useTranslation();
  const navigate = useNavigate();
  const { caterings } = useCateringStore();
  const [customers, setCustomers] = useState<Customer[]>([]);

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
    () =>
      configs(
        t,
        caterings,
        handleProductClick,
        handleTargetAudienceClick,
      ),
    [t, caterings, handleProductClick, handleTargetAudienceClick],
  );

  const getData = async () => {
    modals.closeAll();
    const customers = await getAllCustomers(true);
    setCustomers(customers);
  };

  useEffect(() => {
    getData();
  }, []);

  const dataLoader = useCallback(() => {
    return customers;
  }, [customers]);

  const { data, names, reload } = useFilterData<Customer>({
    dataLoader: dataLoader,
  });

  const addCustomer = useCallback(() => {
    modals.open({
      title: t("Add customer"),
      classNames: { title: "c-catering-font-bold" },
      centered: true,
      size: "lg",
      children: <AddCustomerForm onSuccess={getData} />,
    });
  }, [t]);

  const updateCustomer = useCallback(
    (customer: Customer) => {
      modals.open({
        title: t("Update customer"),
        classNames: { title: "c-catering-font-bold" },
        centered: true,
        size: "lg",
        children: (
          <UpdateCustomerForm
            customer={customer}
            onSuccess={getData}
          />
        ),
      });
    },
    [t],
  );

  return (
    <Stack key={caterings.size} gap={10}>
      <AddButton onClick={addCustomer} />
      <Flex justify="end" align="center">
        <AutocompleteForFilterData
          data={names}
          onReload={reload}
          w={{ base: "50%", sm: "20rem" }}
        />
      </Flex>
      <DataGrid
        columns={dataGridConfigs}
        data={data}
        onRowClick={updateCustomer}
      />
    </Stack>
  );
};

export default CustomerManagement;
