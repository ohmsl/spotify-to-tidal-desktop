// This is a sophisticated web application designed to bridge the gap between Spotify and TIDAL music streaming services. It enables users to seamlessly convert Spotify playlists into TIDAL playlists, facilitating music sharing and discovery across platforms. By simply pasting a Spotify playlist URL, users can initiate an automated process where the app fetches playlist details from Spotify, searches for equivalent tracks on TIDAL, and creates a new TIDAL playlist with the matched tracks. We cater to the needs of music enthusiasts and social groups looking to share their curated playlists, despite using different streaming services. It incorporates advanced matching algorithms to ensure a high success rate in finding corresponding tracks, and provides users with detailed feedback on the conversion process, including any tracks that could not be matched. With a focus on user experience and data privacy, we offer a secure, efficient, and user-friendly way to keep music preferences synchronized across the leading streaming platforms.
import FolderIcon from "@mui/icons-material/Folder";
import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  List,
  MenuItem,
  Paper,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavButtons from "../components/NavButtons";
import Stepper from "../components/Stepper";
import { SpotifyPlaylist } from "../types/SpotifyPlaylist";
import { TidalPlaylist } from "../types/TidalPlaylist";
dayjs.extend(duration);

export default function Home() {
  const navigate = useNavigate();

  const [savedPlaylists, setSavedPlaylists] = useState<
    Array<TidalPlaylist | SpotifyPlaylist>
  >([]); // [ClientTidalPlaylist | ClientSpotifyPlaylist
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [spotifyPlaylistUrl, setSpotifyPlaylistUrl] = useState<string>("");

  useEffect(() => {
    const savedPlaylists = JSON.parse(
      localStorage.getItem("savedPlaylists") || "[]"
    );
    setSavedPlaylists(savedPlaylists);
  }, []);

  const handleClick = async () => {
    const playlistId = spotifyPlaylistUrl.split("/").pop()?.split("?")[0];
    navigate(`/playlist/view/${playlistId}`);
  };

  const handleSavedPlaylistClick = (
    playlist: TidalPlaylist | SpotifyPlaylist
  ) => {
    navigate(`/playlist/convert/${playlist.id}`);
  };

  return (
    <>
      <NavButtons />
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h4" textAlign="center" sx={{ ml: "auto" }}>
            Convert your Spotify playlist to TIDAL
          </Typography>
          <Box sx={{ ml: "auto" }}>
            <IconButton
              color="primary"
              onClick={(e) => setMenuAnchorEl(e.currentTarget)}
            >
              <FolderIcon />
            </IconButton>
          </Box>
        </Box>
        <Stepper step={0} />
        <Paper variant="outlined" sx={{ p: 3 }}>
          <TextField
            id="spotify-playlist-url"
            placeholder="Enter a Spotify Playlist URL"
            variant="outlined"
            value={spotifyPlaylistUrl}
            onChange={(e) => setSpotifyPlaylistUrl(e.target.value)}
            fullWidth
          />
        </Paper>
        <Button variant="text" color="primary" onClick={handleClick}>
          Convert
        </Button>
      </Container>

      <Popover
        open={!!menuAnchorEl}
        onClose={() => setMenuAnchorEl(null)}
        anchorEl={menuAnchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        slotProps={{ paper: { variant: "outlined" } }}
      >
        <Typography variant="h6" sx={{ px: 2, py: 1 }}>
          Saved Playlists
        </Typography>
        <Divider />
        <List>
          {savedPlaylists.map((playlist, index) => (
            <MenuItem
              key={index}
              onClick={() => handleSavedPlaylistClick(playlist)}
            >
              <Typography variant="body1">{playlist.name}</Typography>
            </MenuItem>
          ))}
        </List>
      </Popover>
    </>
  );
}
