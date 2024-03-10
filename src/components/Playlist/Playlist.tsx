import { Box, Paper, Typography } from "@mui/material";
import { sendNotification } from "@tauri-apps/api/notification";
import dayjs from "dayjs";
import { useEffect, useRef } from "react";
import { SpotifyPlaylist } from "../../types/SpotifyPlaylist";
import { TidalPlaylist } from "../../types/TidalPlaylist";
import Stepper from "../Stepper";
import PlaylistCover from "./PlaylistCover";
import PlaylistSpotify from "./PlaylistSpotify";
import PlaylistTidal from "./PlaylistTidal";

type Props = {
  playlist: SpotifyPlaylist | TidalPlaylist;
  step: number;
};

const Playlist = ({ playlist, step }: Props) => {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (playlist.type === "tidal") {
      sendNotification({
        title: "Spotify to TIDAL",
        body: "Your playlist has been processed!",
      });
    }
  }, [playlist.type]);

  return (
    <>
      <Stepper step={step} />
      <Paper sx={{ p: 2 }} variant="outlined">
        <Box sx={{ display: "flex", justifyContent: "center", gap: 4, mb: 2 }}>
          <PlaylistCover
            width={200}
            height={200}
            imageUrl={playlist.images[0].url}
            alt={playlist.name + " cover"}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              justifyContent: "space-around",
            }}
          >
            <Box>
              <Typography variant="h3" sx={{ mr: 4 }}>
                {playlist.name}
              </Typography>
              <Typography variant="body1">{playlist.description}</Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, mr: 2 }}>
              <Typography variant="caption">
                {`Created by ${playlist.owner.displayName} -
                    ${playlist.followers} followers -
                    ${playlist.tracks.length} tracks -
                    ${dayjs
                      .duration(playlist.duration, "milliseconds")
                      .format("H [hr] m [min]")}`}
              </Typography>
            </Box>
          </Box>
        </Box>
        {playlist.type === "spotify" ? (
          <PlaylistSpotify playlist={playlist} />
        ) : (
          <PlaylistTidal playlist={playlist as TidalPlaylist} />
        )}
      </Paper>
    </>
  );
};

export default Playlist;
