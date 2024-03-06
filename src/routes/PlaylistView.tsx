import { Box, Button, Container } from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Playlist from "../components/Playlist/Playlist";
import { useAuth } from "../providers/AuthProvider";
import { ClientSpotifyPlaylist } from "../types/ClientSpotifyPlaylist";
dayjs.extend(duration);

const PlaylistView = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { tidalClientToken, spotifyClientToken, endpoint } = useAuth();

  const [spotifyPlaylist, setSpotifyPlaylist] =
    useState<ClientSpotifyPlaylist>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!tidalClientToken || !spotifyClientToken) return;
    axios
      .get(`${endpoint}/api/get-spotify-playlist/${params.playlistId}`, {
        headers: {
          "x-tidal-client-token": tidalClientToken,
          "x-spotify-client-token": spotifyClientToken,
        },
        timeout: 10000,
      })
      .then((response) => {
        setSpotifyPlaylist(response.data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [tidalClientToken, spotifyClientToken, params.playlistId]);

  const handleClick = () => {
    navigate(`/playlist/convert/${params.playlistId}`);
  };

  return (
    <Container sx={{ display: "flex", flexDirection: "column", gap: 2, my: 3 }}>
      {spotifyPlaylist && <Playlist playlist={spotifyPlaylist} step={1} />}
      {spotifyPlaylist && (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
          <Button variant="text" LinkComponent={Link} href="/">
            Back
          </Button>
          <Button variant="contained" onClick={handleClick}>
            Continue
          </Button>
        </Box>
      )}
      {!spotifyPlaylist && (
        <Loader
          message="This may take a moment..."
          progress={0}
          error={error}
        />
      )}
    </Container>
  );
};

export default PlaylistView;
