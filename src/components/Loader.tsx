import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  CircularProgressProps,
  Link,
  Typography,
  circularProgressClasses,
} from "@mui/material";
import { useEffect, useState } from "react";

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number | undefined }
) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant={
          props.value !== undefined && props.value >= 0
            ? "determinate"
            : "indeterminate"
        }
        size={64}
        sx={{
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: "round",
          },
        }}
        {...props}
        disableShrink={
          props.value !== undefined && props.value >= 0 ? false : true
        }
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
        {props.value !== undefined && props.value >= 0 ? (
          <Typography
            variant="h6"
            component="div"
            color="text.secondary"
          >{`${Math.round(props.value || 0)}%`}</Typography>
        ) : null}
      </Box>
    </Box>
  );
}

type Props = {
  open: boolean;
  progress?: number;
  error?: string;
  message?: string | React.ReactNode;
};

const Loader = ({ open, progress, error, message }: Props) => {
  const [internalOpen, setInternalOpen] = useState(open);

  useEffect(() => {
    if (open) {
      setInternalOpen(true);
    } else {
      setTimeout(() => {
        setInternalOpen(false);
      }, 500);
    }
  }, [open]);

  return (
    <Backdrop
      open={internalOpen}
      sx={{
        background: (theme) => theme.palette.primary.gradient,
        zIndex: 9999,
      }}
    >
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
            <Button
              variant="text"
              color="primary"
              LinkComponent={Link}
              href="/"
            >
              Go back
            </Button>
          </>
        )}
      </Box>
    </Backdrop>
  );
};

export default Loader;
