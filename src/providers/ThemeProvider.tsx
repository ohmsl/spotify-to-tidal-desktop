"use client";
import {
  Box,
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
  Theme,
} from "@mui/material";
import theme from "../../theme";
import useIsMobile from "../hooks/useIsMobile";

export default function ThemeProvider({
  children,
  themeOverride,
}: {
  children: React.ReactNode;
  themeOverride?: Theme;
}) {
  const isMobile = useIsMobile();

  return (
    <MuiThemeProvider theme={themeOverride ? themeOverride : theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: isMobile ? "100%" : "100vh",
          alignItems: "center",
          justifyContent: "center",
          overflowY: "auto",
          overflowX: "hidden",
          flexWrap: "wrap",
          py: 6,
        }}
      >
        {children}
      </Box>
    </MuiThemeProvider>
  );
}
