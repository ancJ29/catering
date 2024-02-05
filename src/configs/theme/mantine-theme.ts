import {
  Checkbox,
  Input,
  PasswordInput,
  createTheme,
} from "@mantine/core";
import classes from "./theme.module.scss";

export const theme = createTheme({
  fontFamily: "Quicksand",
  headings: {
    fontWeight: "900",
    sizes: {
      h1: {
        fontSize: "2.6rem",
      },
    },
  },
  components: {
    Checkbox: Checkbox.extend({
      classNames: {
        label: classes.label,
      },
    }),
    InputWrapper: Input.Wrapper.extend({
      classNames: {
        label: classes.label,
      },
    }),
    Input: Input.extend({
      classNames: {
        input: classes.input,
      },
    }),
    PasswordInput: PasswordInput.extend({
      classNames: {
        label: classes.label,
        input: classes.input,
        innerInput: classes.innerInput,
      },
    }),
  },
  primaryColor: "primary",
  defaultRadius: "sm",
  colors: {
    // https://mantine.dev/colors-generator/?color=754610
    xOrange: [
      // primary: [
      "#fdf5ed",
      "#f6eada",
      "#efd1b0",
      "#e8b780",
      "#e3a259",
      "#df9440",
      "#de8d33",
      "#c57826",
      "#af6b1f",
      "#995b15",
    ],
    // xGreen: [
    primary: [
      "#e7fcf2",
      "#d9f3e8",
      "#b6e2d0",
      "#91d1b7",
      "#72c3a1",
      "#5dba93",
      "#51b68c",
      "#409f78",
      "#338e69",
      "#217c59",
    ],
  },
});
