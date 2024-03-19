import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import TidalIconButton from "./TidalIconButton";

const NavButtons = () => {
  const location = useLocation();
  const [historyIndex, setHistoryIndex] = useState(window.history.state.idx);

  useEffect(() => {
    setHistoryIndex(window.history.state.idx);
  }, [location]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        gap: 1,
        p: 2,
        width: "100%",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        opacity: 0.5,
        transition: "opacity 0.3s",
        "&:hover": { opacity: 1 },
      }}
    >
      <TidalIconButton
        title="Back"
        onClick={() => window.history.back()}
        disabled={historyIndex === 0}
      >
        <ChevronLeft />
      </TidalIconButton>
      <TidalIconButton
        title="Next"
        onClick={() => window.history.forward()}
        disabled={historyIndex === window.history.length - 1}
      >
        <ChevronRight />
      </TidalIconButton>
    </Box>
  );
};

export default NavButtons;
