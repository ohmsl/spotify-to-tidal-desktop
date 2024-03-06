import { Paper } from "@mui/material";

type Props = {
  width: number;
  height: number;
  imageUrl: string;
  alt: string;
};

const PlaylistCover = ({ width, height, imageUrl, alt }: Props) => {
  return (
    <Paper
      sx={{
        width: `${width}px`,
        height: `${height}px`,
        overflow: "hidden",
      }}
    >
      <img src={imageUrl} width={width} height={height} alt={alt} />
    </Paper>
  );
};

export default PlaylistCover;
