import { ExpandMore } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import {
  Box,
  Button,
  List,
  ListItemText,
  MenuItem,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { sendNotification } from "@tauri-apps/api/notification";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TidalPlaylist, TidalTrack } from "../../types/TidalPlaylist";

type Props = {
  playlist: TidalPlaylist;
};

const PlaylistTidal = ({ playlist }: Props) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openMethod, setOpenMethod] = useState<"desktop" | "web">("desktop");

  useEffect(() => {
    if (playlist.type === "tidal") {
      sendNotification({
        title: "Spotify to TIDAL",
        body: "Your playlist has been processed!",
      });
    }
  }, [playlist.type]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Typography variant="h6">Tracks</Typography>
        <Button
          variant="contained"
          onClick={(event) => setAnchorEl(event.currentTarget)}
          endIcon={<ExpandMore />}
        >
          Open In
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Album</TableCell>
            {/* {spotifyPlaylist?.tracks && (
              <TableCell align="left">Confidence</TableCell>
            )} */}
            <TableCell align="right">Duration</TableCell>
            <TableCell align="right">URL</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {playlist.tracks.map((track, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <ListItemText primary={track.title} secondary={track.artist} />
              </TableCell>
              <TableCell>{track.album}</TableCell>
              {/* {spotifyPlaylist?.tracks && (
                <TableCell align="left">
                  {`${calculateMatchConfidence(
                    spotifyPlaylist?.tracks[index],
                    track
                  )}% match`}
                </TableCell>
              )} */}
              <TableCell align="right">
                {dayjs.duration(track.duration, "s").format("m:ss")}
              </TableCell>
              <TableCell align="right">
                <Link
                  to={
                    openMethod === "web"
                      ? (track as TidalTrack).url
                      : `tidal://track/${(track as TidalTrack).id}`
                  }
                  target={openMethod === "web" ? "_blank" : "_self"}
                  rel="noreferrer"
                  style={{
                    color: (track as TidalTrack).quality.includes(
                      "HIRES_LOSSLESS"
                    )
                      ? theme.palette.secondary.main
                      : theme.palette.primary.main,
                    borderColor: (track as TidalTrack).quality.includes(
                      "HIRES_LOSSLESS"
                    )
                      ? theme.palette.secondary.dark
                      : theme.palette.primary.dark,
                  }}
                >
                  Listen
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
        slotProps={{ paper: { variant: "outlined", elevation: 0 } }}
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

export default PlaylistTidal;
