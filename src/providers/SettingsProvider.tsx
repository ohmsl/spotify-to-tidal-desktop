import SettingsIcon from "@mui/icons-material/Settings";
import {
  Box,
  Button,
  DialogActions,
  Divider,
  IconButton,
  List,
  ListItem,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import { createContext, useState } from "react";

type Settings = {
  tidalClientId: string;
  tidalClientSecret: string;
  spotifyClientId: string;
  spotifyClientSecret: string;
};

type SettingsContext = Settings & {
  valid: { [key in keyof Settings]: boolean };
  setValid: (valid: { [key in keyof Settings]: boolean }) => void;
};

export const SettingsContext = createContext<SettingsContext>({
  tidalClientId: "",
  tidalClientSecret: "",
  spotifyClientId: "",
  spotifyClientSecret: "",
  valid: {
    tidalClientId: false,
    tidalClientSecret: false,
    spotifyClientId: false,
    spotifyClientSecret: false,
  },
  setValid: () => {},
});

const SettingsProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const [valid, setValid] = useState<{ [key in keyof Settings]: boolean }>({
    tidalClientId: false,
    tidalClientSecret: false,
    spotifyClientId: false,
    spotifyClientSecret: false,
  });
  const [settings, setSettings] = useState<Settings>(() => {
    const localSettings = localStorage.getItem("settings");
    if (localSettings) {
      return JSON.parse(localSettings);
    }
    return {
      tidalClientId: "",
      tidalClientSecret: "",
      spotifyClientId: "",
      spotifyClientSecret: "",
    };
  });

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSettingsChange = (e: any) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem("settings", JSON.stringify(settings));
    setAnchorEl(null);
  };

  return (
    <>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          p: 2,
          zIndex: (theme) => theme.zIndex.drawer + 2,
        }}
      >
        <IconButton onClick={handleClick}>
          <SettingsIcon />
        </IconButton>
        <Popover
          open={!!anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "center",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          slotProps={{ paper: { variant: "outlined", elevation: 0 } }}
        >
          <Typography variant="h6" sx={{ px: 2, py: 1 }}>
            Settings
          </Typography>
          <Divider />
          <List sx={{ pb: 0 }}>
            <ListItem
              sx={{
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>TIDAL Client ID</Typography>
              </Box>
              <TextField
                name="tidalClientId"
                onChange={handleSettingsChange}
                value={settings.tidalClientId}
                variant="outlined"
                size="small"
                fullWidth
              />
            </ListItem>
            <ListItem
              sx={{
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>TIDAL Client Secret</Typography>
              </Box>
              <TextField
                name="tidalClientSecret"
                onChange={handleSettingsChange}
                value={settings.tidalClientSecret}
                variant="outlined"
                size="small"
                fullWidth
              />
            </ListItem>
            <ListItem
              sx={{
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Spotify Client ID</Typography>
              </Box>
              <TextField
                name="spotifyClientId"
                onChange={handleSettingsChange}
                value={settings.spotifyClientId}
                variant="outlined"
                size="small"
                fullWidth
              />
            </ListItem>
            <ListItem
              sx={{
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Spotify Client Secret</Typography>
              </Box>
              <TextField
                name="spotifyClientSecret"
                onChange={handleSettingsChange}
                value={settings.spotifyClientSecret}
                variant="outlined"
                size="small"
                fullWidth
              />
            </ListItem>
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Set your API keys here for exclusive conversions
              </Typography>
            </Box>
          </List>
          <DialogActions sx={{ pt: 0 }}>
            <Button onClick={() => setAnchorEl(null)}>Close</Button>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </DialogActions>
        </Popover>
      </Box>
      <SettingsContext.Provider value={{ ...settings, valid, setValid }}>
        {props.children}
      </SettingsContext.Provider>
    </>
  );
};

export default SettingsProvider;
