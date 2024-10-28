import useTranslation from "@/hooks/useTranslation";
import useAuthStore from "@/stores/auth.store";
import { Flex, TextInput } from "@mantine/core";

const Dashboard = () => {
  const t = useTranslation();
  const { user } = useAuthStore();

  return (
    <Flex align="center" justify="center" direction="column" gap={10}>
      <TextInput
        w={{ base: "90vw", sm: "40vw" }}
        label={t("Username")}
        value={user?.userName}
      />
      <TextInput
        w={{ base: "90vw", sm: "40vw" }}
        label={t("Full name")}
        value={user?.fullName}
      />
      <TextInput
        w={{ base: "90vw", sm: "40vw" }}
        label={t("Role")}
        value={t(`user.role.${user?.roles[0]}`)}
      />
    </Flex>
  );
};

export default Dashboard;
