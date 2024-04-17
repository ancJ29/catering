import {
  CSSVariablesResolver,
  Checkbox,
  Input,
  PasswordInput,
  Switch,
  createTheme,
} from "@mantine/core";
import classes from "./theme.module.scss";

const labelStyle = {
  fontSize: "1rem",
  fontWeight: "500",
  color: "var(--input-label-color)",
};

// https://mantine.dev/styles/css-variables/#css-variables-resolver
export const resolver: CSSVariablesResolver = (theme) => ({
  variables: {
    "--main-color": theme.colors.primary[7],
    "--input-label-color": theme.colors.primary[4],
    "--input-placeholder-color": theme.colors.primary[2],
    "--border-color": "#ebebeb",
    "--highlight-color": theme.colors.primary[2],
    "--input-highlight-color": theme.colors.primary[2],
    "--hover-background-color": theme.colors.primary[3],
    "--navbar-active-background-color": theme.colors.primary[5],
  },
  light: {},
  dark: {},
});

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
      styles: {
        label: labelStyle,
      },
    }),
    InputWrapper: Input.Wrapper.extend({
      styles: {
        label: labelStyle,
      },
    }),
    Input: Input.extend({
      classNames: {
        input: classes.input,
      },
    }),
    PasswordInput: PasswordInput.extend({
      classNames: {
        input: classes.input,
        innerInput: classes.innerInput,
      },
    }),
    Switch: Switch.extend({
      styles: {
        label: labelStyle,
      },
    }),
  },
  primaryColor: "primary",
  defaultRadius: "sm",
  colors: {
    // https://mantine.dev/colors-generator/?color=F21616
    error: [
      "#ffe9e9",
      "#ffd1d1",
      "#fba0a1",
      "#f76d6d",
      "#f34141",
      "#f22625",
      "#f21616",
      "#d8070b",
      "#c10008",
      "#a90003",
    ],
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
