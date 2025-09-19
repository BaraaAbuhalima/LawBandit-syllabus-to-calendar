"use client";
import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  useTheme,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <AppBar
        position="sticky"
        color="transparent"
        enableColorOnDark
        sx={{
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar>
          <CalendarMonthIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Syllabus → Calendar
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: { xs: 4, md: 6 } }}>
        {children}
      </Container>
      <Box
        component="footer"
        sx={{
          py: 3,
          textAlign: "center",
          typography: "caption",
          color: "text.secondary",
        }}
      ></Box>
    </Box>
  );
}
