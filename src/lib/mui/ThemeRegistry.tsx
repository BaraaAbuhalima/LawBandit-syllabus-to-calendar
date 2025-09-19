"use client";
import { ReactNode, useMemo } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

interface ThemeRegistryProps {
  children: ReactNode;
}

const baseTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#4F8CFF", light: "#82AFFF", dark: "#2B5CA8" },
    secondary: { main: "#FF9F43", light: "#FFB873", dark: "#C56E13" },
    background: { default: "#0D1014", paper: "#161A21" },
    success: { main: "#2ECC71" },
    error: { main: "#E74C3C" },
    warning: { main: "#F1C40F" },
    info: { main: "#3498DB" },
    divider: "#232A32",
    text: {
      primary: "#E6EBF3",
      secondary: "#94A3B8",
      disabled: "#5B6470",
    },
  },
  shape: { borderRadius: 10 },
  spacing: 8,
  typography: {
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
    h1: { fontSize: "3rem", fontWeight: 600, letterSpacing: -1 },
    h2: { fontSize: "2.25rem", fontWeight: 600, letterSpacing: -0.5 },
    h3: { fontSize: "1.75rem", fontWeight: 600 },
    h4: { fontSize: "1.4rem", fontWeight: 600 },
    h5: { fontSize: "1.15rem", fontWeight: 600 },
    h6: { fontSize: "1rem", fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    body1: { lineHeight: 1.55 },
    body2: { lineHeight: 1.5 },
    button: { fontWeight: 500, letterSpacing: 0.2 },
    caption: { fontSize: "0.72rem", letterSpacing: 0.4 },
  },
  shadows: [
    "none",
    "0 1px 2px 0 rgba(0,0,0,0.3)",
    "0 1px 3px 0 rgba(0,0,0,0.35),0 1px 2px -1px rgba(0,0,0,0.25)",
    "0 2px 4px -1px rgba(0,0,0,0.35),0 4px 6px -1px rgba(0,0,0,0.3)",
    "0 4px 6px -1px rgba(0,0,0,0.4),0 10px 15px -3px rgba(0,0,0,0.35)",
    "0 10px 15px -3px rgba(0,0,0,0.45),0 4px 6px -2px rgba(0,0,0,0.3)",
    "0 12px 17px -2px rgba(0,0,0,0.5),0 5px 8px -1px rgba(0,0,0,0.35)",
    "0 4px 8px -1px rgba(0,0,0,0.45)",
    "0 5px 10px -2px rgba(0,0,0,0.5)",
    "0 6px 12px -2px rgba(0,0,0,0.5)",
    "0 7px 14px -3px rgba(0,0,0,0.52)",
    "0 8px 16px -3px rgba(0,0,0,0.52)",
    "0 9px 18px -3px rgba(0,0,0,0.53)",
    "0 10px 20px -4px rgba(0,0,0,0.53)",
    "0 11px 22px -4px rgba(0,0,0,0.54)",
    "0 12px 24px -4px rgba(0,0,0,0.54)",
    "0 13px 26px -5px rgba(0,0,0,0.55)",
    "0 14px 28px -5px rgba(0,0,0,0.55)",
    "0 15px 30px -5px rgba(0,0,0,0.55)",
    "0 16px 32px -6px rgba(0,0,0,0.56)",
    "0 17px 34px -6px rgba(0,0,0,0.56)",
    "0 18px 36px -6px rgba(0,0,0,0.57)",
    "0 19px 38px -7px rgba(0,0,0,0.57)",
    "0 20px 40px -7px rgba(0,0,0,0.58)",
    "0 21px 42px -7px rgba(0,0,0,0.58)",
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "radial-gradient(circle at 25% 15%, #18202A, #0D1014 70%)",
          backgroundAttachment: "fixed",
        },
        "::-webkit-scrollbar": { width: 10 },
        "::-webkit-scrollbar-track": { background: "transparent" },
        "::-webkit-scrollbar-thumb": {
          background: "rgba(120,140,160,0.35)",
          borderRadius: 6,
        },
        "::-webkit-scrollbar-thumb:hover": {
          background: "rgba(140,160,180,0.5)",
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 500, borderRadius: 8 },
        sizeSmall: { padding: "4px 14px", fontSize: "0.75rem" },
        sizeMedium: { padding: "8px 18px", fontSize: "0.8rem" },
        sizeLarge: { padding: "12px 24px", fontSize: "0.9rem" },
      },
      variants: [
        {
          props: { variant: "contained", color: "primary" },
          style: {
            background: "linear-gradient(90deg,#4F8CFF,#4F70FF)",
            boxShadow: "0 4px 12px -2px rgba(79,140,255,.4)",
            '&:hover': {
              background: "linear-gradient(90deg,#6299FF,#4F70FF)",
            },
          },
        },
      ],
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#161A21",
          border: "1px solid #212830",
        },
        elevation6: { boxShadow: "0 4px 18px -2px rgba(0,0,0,0.55)" },
        rounded: { borderRadius: 16 },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { backgroundColor: "#161A21", borderRadius: 18 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500, letterSpacing: 0.3 },
      },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: "#222B33" } },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#1F2630",
          border: "1px solid #2C3742",
          fontSize: "0.7rem",
          borderRadius: 8,
        },
      },
    },
  },
});

export default function ThemeRegistry({ children }: ThemeRegistryProps) {
  const theme = useMemo(() => baseTheme, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
