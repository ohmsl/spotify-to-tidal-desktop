import { Box, Button, Container, Link } from "@mui/material";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
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

  useEffect(() => {
    if (!tidalClientToken || !spotifyClientToken) return;
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

    axios
      .post(
        `/api/convert-spotify-playlist/${params.playlistId}`,
        {},
        {
          headers: {
            "x-tidal-client-token": tidalClientToken,
            "x-spotify-client-token": spotifyClientToken,
          },
        }
      )
      .then((response) => {
        setPlaylist(response.data);
        playlistRef.current = response.data;
        console.log("fetched playlist from server");
        clearInterval(interval);
      })
      .catch((error: AxiosError) => {
        if (error.code === "ERR_NETWORK") {
          setError(
            "Could not connect to server, check your internet connection and try again later."
          );
          return;
        }
        if (error.response?.status === 429) {
          setError("Rate limited, please try again later.");
        } else {
          setError(
            error.request?.statusText ||
              "An unknown error occurred, please try again later."
          );
        }
        console.error(error);
        clearInterval(interval);
      });
    const interval: NodeJS.Timeout = setInterval(() => {
      axios
        .get(`/api/convert-spotify-playlist/${params.playlistId}`, {})
        .then((response) => {
          setProgress(response.data.progress);
        })
        .catch((error: AxiosError) => {
          console.error("Error polling progress: ", error);
        });
    }, 1000);
    return () => clearInterval(interval);
  }, [tidalClientToken, spotifyClientToken, params.playlistId]);

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
    </Container>
  );
};

export default PlaylistConvert;
