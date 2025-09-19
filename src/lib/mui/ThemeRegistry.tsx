"use client";
import { ReactNode, useMemo } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

interface ThemeRegistryProps {
  children: ReactNode;
}

const baseTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#4f8cff" },
    secondary: { main: "#ff9f43" },
    background: { default: "#0f1115", paper: "#181b21" },
    success: { main: "#2ecc71" },
    error: { main: "#e74c3c" },
    warning: { main: "#f1c40f" },
    info: { main: "#3498db" },
  },
  shape: { borderRadius: 6 },
  typography: { fontFamily: "var(--font-geist-sans), system-ui, sans-serif" },
  components: {
    MuiButton: {
      styleOverrides: { root: { textTransform: "none", fontWeight: 500 } },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
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
