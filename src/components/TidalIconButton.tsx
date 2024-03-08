import { IconButton, styled } from "@mui/material";

const TidalIconButton = styled(IconButton)(({ theme }) => ({
  color: "white",
  backgroundColor: theme.palette.background.paper,
  border: "1px solid rgba(255, 255, 255, 0.1)",
  ":hover": {
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  transition: "background-color .35s ease",
  "&:disabled": {
    opacity: 0.8,
    cursor: "not-allowed",
  },
}));

export default TidalIconButton;
