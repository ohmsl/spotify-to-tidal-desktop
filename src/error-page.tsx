import { Box, Button, Typography } from "@mui/material";
import { useRouteError } from "react-router-dom";
import NavButtons from "./components/NavButtons";

const ErrorPage = () => {
  const error: any = useRouteError();
  console.error(error);

  return (
    <>
      <NavButtons />
      <Box display="flex" justifyContent="center" alignItems="center">
        <div style={{ textAlign: "center" }}>
          <Typography variant="h4" color="error">
            Oops! Something busted.
          </Typography>

          <Typography variant="h6" color="textSecondary">
            {error.statusText || error.message || "Unknown error"}
          </Typography>
          <Button
            sx={{ mt: 1 }}
            onClick={() => window.location.reload()}
            variant="outlined"
            color="primary"
          >
            Reload
          </Button>
        </div>
      </Box>
    </>
  );
};

export default ErrorPage;
