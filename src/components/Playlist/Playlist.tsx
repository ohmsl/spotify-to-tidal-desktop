import { ExpandMore } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import {
  Box,
  Button,
  List,
  ListItemText,
  MenuItem,
  Paper,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ClientSpotifyPlaylist } from "../../types/ClientSpotifyPlaylist";
import { ClientTidalPlaylist } from "../../types/ClientTidalPlaylist";
import Stepper from "../Stepper";
import PlaylistCover from "./PlaylistCover";

type Props = {
  playlist: ClientSpotifyPlaylist | ClientTidalPlaylist;
  step: number;
};

const Playlist = ({ playlist, step }: Props) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openMethod, setOpenMethod] = useState<"desktop" | "web">("desktop");
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography variant="h6">Tracks</Typography>
          {playlist.type === "tidal" && (
            <Button
              variant="contained"
              onClick={(event) => setAnchorEl(event.currentTarget)}
              endIcon={<ExpandMore />}
            >
              Open In
            </Button>
          )}
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Album</TableCell>
              <TableCell align="right">Duration</TableCell>
              {playlist.type === "tidal" && (
                <TableCell align="right">URL</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {(playlist.type === "spotify"
              ? playlist.tracks.slice(0, 5)
              : playlist.tracks
            ).map((track, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <ListItemText
                    primary={track.title}
                    secondary={track.artist}
                  />
                </TableCell>
                <TableCell>{track.album}</TableCell>
                <TableCell align="right">
                  {dayjs
                    .duration(
                      track.duration,
                      playlist.type === "tidal" ? "s" : "ms"
                    )
                    .format("m:ss")}
                </TableCell>
                {playlist.type === "tidal" && (
                  <TableCell align="right">
                    <Link
                      to={
                        openMethod === "web"
                          ? (track as ClientTidalPlaylist["tracks"][0]).url
                          : `tidal://track/${
                              (track as ClientTidalPlaylist["tracks"][0]).id
                            }`
                      }
                      target={openMethod === "web" ? "_blank" : "_self"}
                      rel="noreferrer"
                      style={{
                        color: (
                          track as ClientTidalPlaylist["tracks"][0]
                        ).quality.includes("HIRES_LOSSLESS")
                          ? theme.palette.secondary.main
                          : theme.palette.primary.main,
                        borderColor: (
                          track as ClientTidalPlaylist["tracks"][0]
                        ).quality.includes("HIRES_LOSSLESS")
                          ? theme.palette.secondary.dark
                          : theme.palette.primary.dark,
                      }}
                    >
                      Listen
                    </Link>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {playlist.tracks.length > 5 && playlist.type === "spotify" && (
              <TableRow>
                <TableCell colSpan={5} align="right">
                  <Typography variant="caption">
                    and {playlist.tracks.length - 5} more
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
      <Popover
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{ paper: { variant: "outlined" } }}
        sx={{ mt: 0.5 }}
      >
        <List>
          <MenuItem
            sx={{ gap: 1 }}
            onClick={() => {
              setOpenMethod("desktop");
              setAnchorEl(null);
            }}
          >
            Desktop App
            {openMethod === "desktop" && <CheckIcon />}
          </MenuItem>
          <MenuItem
            sx={{ gap: 1 }}
            onClick={() => {
              setOpenMethod("web");
              setAnchorEl(null);
            }}
          >
            Web Player
            {openMethod === "web" && <CheckIcon />}
          </MenuItem>
        </List>
      </Popover>
    </>
  );
};

export default Playlist;
