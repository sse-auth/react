type Theme = "dark" | "light";

type FontOptions =
  | "Open Sans"
  | "ui-sans-serif"
  | "system-ui"
  | "-apple-system"
  | "Segoe UI"
  | "Roboto"
  | "Helvetica Neue"
  | "Arial"
  | "Noto Sans"
  | "sans-serif"
  | "Apple Color Emoji"
  | "Segoe UI Emoji"
  | "Segoe UI Symbol"
  | "Noto Color Emoji";

export interface PageOptions {
  theme?: Theme;
  font?: FontOptions;
  site?: {
    name?: string;
  };
}
