import { Card as MantineCard } from "@mantine/core";
import { TablerIconsProps } from "@tabler/icons-react";
import { DashboardDataType } from "../../_configs";
import Grid from "../Grid";
import Item from "../Item";
import Title from "../Title";
import classes from "./Container.module.scss";

type ContainerProps = {
  icon: (props: TablerIconsProps) => JSX.Element;
  title: string;
  data: DashboardDataType[];
};

const Container = ({ icon, title, data }: ContainerProps) => {
  return (
    <MantineCard withBorder radius="md" className={classes.card}>
      <Title icon={icon} title={title} />
      <Grid>
        {data.map((item, index) => (
          <Item key={index} item={item} />
        ))}
      </Grid>
    </MantineCard>
  );
};

export default Container;
