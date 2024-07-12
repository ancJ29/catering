import { ClientRoles } from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import useAuthStore from "@/stores/auth.store";
import useCateringStore from "@/stores/catering.store";
import useDailyMenuStore from "@/stores/daily-menu.store";
import { unique } from "@/utils";
import { Box } from "@mantine/core";
import { useMemo } from "react";

const Alert = () => {
  const t = useTranslation();
  const { role } = useAuthStore();
  const { alertItems } = useDailyMenuStore();
  const { caterings } = useCateringStore();
  const cateringNames = useMemo(() => {
    const names = unique(alertItems.map((el) => el.others.cateringId))
      .map((cateringId) => {
        return caterings.get(cateringId)?.name;
      })
      .filter(Boolean) as string[];
    return names.join(", ");
  }, [alertItems, caterings]);

  if (!alertItems.length) {
    return <></>;
  }

  if (role === ClientRoles.PRODUCTION) {
    return (
      <Box bg="error.5" c="white" ta="center" fw={700} my={5}>
        {t("Daily menu is not sent to catering")}: {cateringNames}
      </Box>
    );
  }

  if (role === ClientRoles.CATERING) {
    return (
      <Box bg="error.5" c="white" ta="center" fw={700} my={5}>
        {t("Currently")} {alertItems.length}{" "}
        {t("weekly menu(s) pending confirmation")}
      </Box>
    );
  }

  return <></>;
};

export default Alert;
