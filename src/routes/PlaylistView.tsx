import { Box, Button, Container } from "@mui/material";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getSpotifyPlaylist } from "../api/getSpotifyPlaylist";
import Loader from "../components/Loader";
import NavButtons from "../components/NavButtons";
import Playlist from "../components/Playlist/Playlist";
import { useAuth } from "../providers/AuthProvider";
import { ClientSpotifyPlaylist } from "../types/ClientSpotifyPlaylist";
dayjs.extend(duration);

const PlaylistView = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const { tidalClientToken, spotifyClientToken } = useAuth();

  const [spotifyPlaylist, setSpotifyPlaylist] =
    useState<ClientSpotifyPlaylist>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!tidalClientToken || !spotifyClientToken)
      throw new Error("Not authenticated");
    if (!playlistId) throw new Error("Missing playlist ID");
    getSpotifyPlaylist(spotifyClientToken, playlistId)
      .then((response) => {
        if ("error" in response.data) {
          setError(response.data.error);
          return;
        }
        setSpotifyPlaylist(response.data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [tidalClientToken, spotifyClientToken, playlistId]);

  const handleClick = () => {
    navigate(`/playlist/convert/${playlistId}`);
  };

  return (
    <>
      <NavButtons />
      <Container
        sx={{ display: "flex", flexDirection: "column", gap: 2, my: 3 }}
      >
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
    </>
  );
};

export default PlaylistView;
