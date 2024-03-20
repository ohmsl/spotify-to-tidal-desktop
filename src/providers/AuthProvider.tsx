"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { obtainCredentials } from "../api/obtainCredentials";
import { AlertContext } from "./AlertProvider";
import { SettingsContext } from "./SettingsProvider";

const endpoint = import.meta.env.VITE_API_ENDPOINT;

interface AuthContextType {
  tidalClientToken: string | null;
  spotifyClientToken: string | null;
  fetchAndSetAuthTokens: () => Promise<void>;
  endpoint: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { sendAlert } = useContext(AlertContext);
  const settings = useContext(SettingsContext);
  const [tidalClientToken, setTidalClientToken] = useState<string | null>(null);
  const [spotifyClientToken, setSpotifyClientToken] = useState<string | null>(
    null
  );

  const fetchAndSetAuthTokens = useCallback(async () => {
    try {
      // Attempt to fetch the token from local storage
      console.log("Fetching and setting auth tokens");
      const storedTidalToken = localStorage.getItem("tidalToken");
      const storedSpotifyToken = localStorage.getItem("spotifyToken");
      const tidalTokenDetails = storedTidalToken
        ? JSON.parse(storedTidalToken)
        : null;
      const spotifyTokenDetails = storedSpotifyToken
        ? JSON.parse(storedSpotifyToken)
        : null;

      const now = new Date();

      if (
        tidalTokenDetails &&
        tidalTokenDetails.expires &&
        new Date(tidalTokenDetails.expires) > now &&
        spotifyTokenDetails &&
        spotifyTokenDetails.spotifyExpires &&
        new Date(spotifyTokenDetails.spotifyExpires) > now
      ) {
        setTidalClientToken(tidalTokenDetails.token);
        setSpotifyClientToken(spotifyTokenDetails.token);
      } else {
        // Token is expired or not present; fetch a new one
        console.log("settings:", settings);
        const response = await obtainCredentials(
          settings.tidalClientId,
          settings.tidalClientSecret,
          settings.spotifyClientId,
          settings.spotifyClientSecret
        );
        console.log("Response from obtainCredentials:", response);

        if ("error" in response.data) {
          console.error(
            "Error obtaining the auth tokens:",
            response.data.error
          );
          sendAlert({
            message: `Error obtaining the spotify token ${
              process.env.NODE_ENV === "development"
                ? `- ${response.data.error}`
                : ""
            }`,
            severity: "error",
          });
          return;
        }

        const { tidalResponse, spotifyResponse } = response.data;

        if ("error" in response.data.spotifyResponse) {
          console.error(
            "Error obtaining spotify token:",
            response.data.spotifyResponse.error
          );
          sendAlert({
            message: `Error obtaining spotify token ${
              process.env.NODE_ENV === "development"
                ? `- ${response.data.spotifyResponse.error}`
                : ""
            }`,
            severity: "error",
          });
          return;
        }

        if ("error" in response.data.tidalResponse) {
          console.error(
            "Error obtaining tidal token:",
            response.data.tidalResponse.error
          );
          sendAlert({
            message: `Error obtaining TIDAL token ${
              process.env.NODE_ENV === "development"
                ? `- ${response.data.tidalResponse.error}`
                : ""
            }`,
            severity: "error",
          });
          return;
        }

        const tidalExpires = new Date(
          now.getTime() + tidalResponse.expires_in * 1000
        ).toISOString();

        const spotifyExpires = new Date(
          now.getTime() + spotifyResponse.expires_in * 1000
        ).toISOString();

        localStorage.setItem(
          "tidalToken",
          JSON.stringify({
            token: tidalResponse.access_token,
            expires: tidalExpires,
          })
        );
        setTidalClientToken(tidalResponse.access_token);
        settings.setValid({
          ...settings.valid,
          tidalClientId: true,
          tidalClientSecret: true,
        });

        localStorage.setItem(
          "spotifyToken",
          JSON.stringify({
            token: spotifyResponse.access_token,
            spotifyExpires,
          })
        );
        setSpotifyClientToken(spotifyResponse.access_token);
        settings.setValid({
          ...settings.valid,
          spotifyClientId: true,
          spotifyClientSecret: true,
        });
      }
    } catch (error) {
      console.error("Error obtaining the TIDAL client token:", error);
      // sendAlert({
      //   message: `Error obtaining the TIDAL client token ${
      //     process.env.NODE_ENV === "development" ? `- ${error}` : ""
      //   }`,
      //   severity: "error",
      // });
    }
  }, []);

  useEffect(() => {
    fetchAndSetAuthTokens();
  }, [fetchAndSetAuthTokens]);

  return (
    <AuthContext.Provider
      value={{
        tidalClientToken,
        spotifyClientToken,
        fetchAndSetAuthTokens,
        endpoint,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
