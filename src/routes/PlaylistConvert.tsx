import { Alert, Box, Button, Container, Link } from "@mui/material";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { convertSpotifyPlaylist } from "../api/convertPlaylist";
import Loader from "../components/Loader";
import NavButtons from "../components/NavButtons";
import Playlist from "../components/Playlist/Playlist";
import { useAuth } from "../providers/AuthProvider";
import { ClientTidalPlaylist } from "../types/ClientTidalPlaylist";
dayjs.extend(duration);

const PlaylistConvert = () => {
  const params = useParams();
  const { tidalClientToken, spotifyClientToken } = useAuth();

  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const [playlist, setPlaylist] = useState<ClientTidalPlaylist>();
  const playlistRef = useRef<ClientTidalPlaylist>();
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) {
      console.log(
        "Fetch operation skipped because it has already been executed."
      );
      return;
    }

    if (!tidalClientToken || !spotifyClientToken)
      throw new Error("Not authenticated");
    if (!params.playlistId) throw new Error("Missing playlist ID");
    if (playlistRef.current) {
      setPlaylist(playlistRef.current);
      return;
    }
    if (localStorage.getItem("savedPlaylists")) {
      const savedPlaylists = JSON.parse(
        localStorage.getItem("savedPlaylists") || "[]"
      );
      if (savedPlaylists.length > 0) {
        const playlist = savedPlaylists.find(
          (playlist: ClientTidalPlaylist) => playlist.id === params.playlistId
        );
        if (playlist) {
          setPlaylist(playlist);
          playlistRef.current = playlist;
          console.log("found playlist in saved playlists");
          return;
        }
      }
    }

    convertSpotifyPlaylist(
      tidalClientToken,
      spotifyClientToken,
      params.playlistId,
      setProgress
    )
      .then((response) => {
        if ("error" in response.data) {
          setError(response.data.error);
          return;
        }
        setPlaylist(response.data);
        playlistRef.current = response.data;
        console.log("fetched playlist from server");
      })
      .catch((error) => {
        setError(error.message);
      });
    hasFetchedRef.current = true;
  }, []);

  const handleSave = () => {
    const savedPlaylists = JSON.parse(
      localStorage.getItem("savedPlaylists") || "[]"
    );
    localStorage.setItem(
      "savedPlaylists",
      JSON.stringify([...savedPlaylists, playlist])
    );
  };

  return (
    <>
      <NavButtons />
      <Container sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {playlist && <Playlist playlist={playlist} step={3} />}
        {playlist && (
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
            <Button
              variant="text"
              LinkComponent={Link}
              href={`/playlist/view/${params.playlistId}`}
            >
              Back
            </Button>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </Box>
        )}
        {!playlist && (
          <Loader
            message="This may take a moment..."
            progress={progress}
            error={error}
          />
        )}
        {!playlist && (
          <Alert
            severity="info"
            sx={{
              position: "fixed",
              top: 12,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            You can background this process, we'll let you know when it's done.
          </Alert>
        )}
      </Container>
    </>
  );
};

export default PlaylistConvert;
