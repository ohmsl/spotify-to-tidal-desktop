"use client";
import "@fontsource/dm-sans";
import "@fontsource/poppins";
import { darkScrollbar } from "@mui/material";
import { createTheme } from "@mui/material/styles";
declare module "@mui/material/styles" {
  interface SimplePaletteColorOptions {
    gradient?: string;
  }
  interface PaletteColor {
    gradient?: string;
  }
  // allow configuration using `createTheme`
  interface Palette {
    primary: PaletteColor;
    secondary: PaletteColor;
  }
}

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#101015",
      paper: "#1C2026",
    },
    primary: {
      main: "#33FFEE",
      gradient:
        "linear-gradient(215deg,#171d26 15%,#000 85%) no-repeat 50% fixed",
    },
    secondary: {
      main: "#FFBE7D",
      gradient: "linear-gradient(to right, #FFBE7D, #FF7F00)",
    },
    error: {
      main: "#EF3265",
    },
    text: {
      primary: "rgb(255, 255, 255)",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: "'DM Sans', Arial, Helvetica, sans-serif",
    caption: {
      fontFamily: "'Poppins', Arial, Helvetica, sans-serif",
      fontWeight: 400,
    },
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: 0,
        },
      },
    },

    MuiCssBaseline: {
      styleOverrides(theme) {
        return {
          html: {
            WebkitFontSmoothing: "auto",
          },
          body: {
            maxWidth: "100vw",
            overflowX: "hidden",
            backgroundColor: theme.palette.background.default,
            background: theme.palette.primary.gradient,
            body: theme.palette.mode === "dark" ? darkScrollbar() : null,
          },
          a: {
            fontWeight: 600,
            textDecoration: "none",
            borderBottom: "1px solid rgba(255, 255, 255, 0.5)",
          },
        };
      },
    },
  },
});

export default theme;
