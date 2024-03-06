import {
  Box,
  Button,
  CircularProgress,
  CircularProgressProps,
  Link,
  Typography,
  circularProgressClasses,
} from "@mui/material";

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number | undefined }
) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant={props.value ? "determinate" : "indeterminate"}
        size={64}
        sx={{
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: "round",
          },
        }}
        {...props}
        disableShrink={props.value ? false : true}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {props.value && props.value !== 0 ? (
          <Typography
            variant="h6"
            component="div"
            color="text.secondary"
          >{`${Math.round(props.value)}%`}</Typography>
        ) : null}
      </Box>
    </Box>
  );
}

type Props = {
  progress?: number;
  error?: string;
  message?: string;
};

const Loader = ({ progress, error, message }: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      }}
    >
      {!error ? (
        <>
          <Box>
            <CircularProgressWithLabel value={progress} />
          </Box>
          <Typography variant="h6">{message}</Typography>
        </>
      ) : (
        <>
          <Typography variant="h6" color="error">
            {error}
          </Typography>
          <Button variant="text" color="primary" LinkComponent={Link} href="/">
            Go back
          </Button>
        </>
      )}
    </Box>
  );
};

export default Loader;
