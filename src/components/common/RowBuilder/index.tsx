import { Box, Text } from "@mantine/core";
import classes from "./Row.module.scss";
import useTranslation from "@/hooks/useTranslation";

type RowsBuilder<T> = {
  data: T[];
  onClick?: (value: T) => void;
  _records: (
    data: T,
    t?: (k: string) => string,
  ) => {
    label: string;
    style: React.CSSProperties;
    value: React.ReactNode;
  }[];
};
function RowsBuilder<T>({ data, onClick, _records }: RowsBuilder<T>) {
  const t = useTranslation();

  return (
    <>
      {data.length > 0 &&
        data.map((item, inx) => (
          <Box
            key={inx}
            className={classes.item}
            onClick={() => onClick && onClick(item)}
          >
            {_records(item, t).map(
              ({ label, style, value }, index) => {
                return (
                  <Box
                    key={index}
                    style={style}
                    className={classes.itemDetail}
                  >
                    <Text className={classes.label}>
                      {t(label || "")}
                    </Text>
                    <Text className={classes.value}>{value}</Text>
                  </Box>
                );
              },
            )}
          </Box>
        ))}
    </>
  );
}

export default RowsBuilder;
