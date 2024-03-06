import { invoke } from "@tauri-apps/api";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./error-page";
import AuthProvider from "./providers/AuthProvider";
import ThemeProvider from "./providers/ThemeProvider";
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
    path: "/playlist/view/:id",
    element: <PlaylistView />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
