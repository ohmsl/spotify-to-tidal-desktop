import {
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { SpotifyPlaylist } from "../../types/SpotifyPlaylist";

type Props = {
  playlist: SpotifyPlaylist;
};

const PlaylistSpotify = ({ playlist }: Props) => {
  return (
    <>
      <Typography variant="h6">Tracks</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Album</TableCell>
            <TableCell align="right">Duration</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {playlist.tracks.slice(0, 5).map((track, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <ListItemText primary={track.title} secondary={track.artist} />
              </TableCell>
              <TableCell>{track.album}</TableCell>
              <TableCell align="right">
                {dayjs.duration(track.duration, "ms").format("m:ss")}
              </TableCell>
            </TableRow>
          ))}
          {playlist.tracks.length > 5 && (
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
    </>
  );
};

export default PlaylistSpotify;
