import { invoke } from "@tauri-apps/api";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./error-page";
import { AlertProvider } from "./providers/AlertProvider";
import AuthProvider from "./providers/AuthProvider";
import { ConversionProvider } from "./providers/ConversionProvider";
import SettingsProvider from "./providers/SettingsProvider";
import ThemeProvider from "./providers/ThemeProvider";
import PlaylistConvert from "./routes/PlaylistConvert";
import PlaylistView from "./routes/PlaylistView";
import Home from "./routes/root";

invoke("start_express_server");

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/error",
    element: <ErrorPage />,
  },
  {
    path: "/playlist/view/:playlistId",
    element: <PlaylistView />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/playlist/convert/:playlistId",
    element: <PlaylistConvert />,
    errorElement: <ErrorPage />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <SettingsProvider>
        <AlertProvider>
          <AuthProvider>
            <ConversionProvider>
              <RouterProvider router={router} />
            </ConversionProvider>
          </AuthProvider>
        </AlertProvider>
      </SettingsProvider>
    </ThemeProvider>
  </React.StrictMode>
);
