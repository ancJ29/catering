import useTranslation from "@/hooks/useTranslation";
import { formatTime } from "@/utils";
import { Box } from "@mantine/core";

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
      style={{
        display: "flex",
        justifyContent: "flex-end",
        paddingRight: "1rem",
        width: "250px",
        flexGrow: !hasActionColumn ? 1 : undefined,
      }}
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
