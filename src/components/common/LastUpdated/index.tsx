import useTranslation from "@/hooks/useTranslation";
import { formatTime } from "@/utils";
import { Box } from "@mantine/core";
import clsx from "clsx";

const LastUpdated = ({
  lastModifiedBy,
  updatedAt,
  hasActionColumn,
}: {
  hasActionColumn?: boolean;
  lastModifiedBy: string;
  updatedAt?: Date;
}) => {
  const t = useTranslation();
  return (
    <Box
      className={clsx("c-catering-last-updated", {
        "c-catering-last-column": !hasActionColumn,
      })}
    >
      <div className="c-catering-fz-dot8rem">
        <b>{t("Last modifier")}</b>:&nbsp;
        {(lastModifiedBy as string) || "-"}
        <br />
        <b>{t("Last updated")}</b>:&nbsp;
        <span>{formatTime(updatedAt)}</span>
      </div>
    </Box>
  );
};

export default LastUpdated;
