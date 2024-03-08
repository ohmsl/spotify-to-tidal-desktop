"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { obtainCredentials } from "../api/obtainCredentials";

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
  const [tidalClientToken, setTidalClientToken] = useState<string | null>(null);
  const [spotifyClientToken, setSpotifyClientToken] = useState<string | null>(
    null
  );

  const fetchAndSetAuthTokens = useCallback(async () => {
    try {
      // Attempt to fetch the token from local storage
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
        const response = await obtainCredentials();
        if ("error" in response.data) {
          throw new Error("Failed to obtain credentials");
        }
        const { tidalResponse, spotifyResponse } = response.data;

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

        localStorage.setItem(
          "spotifyToken",
          JSON.stringify({
            token: spotifyResponse.access_token,
            spotifyExpires,
          })
        );
        setSpotifyClientToken(spotifyResponse.access_token);
      }
    } catch (error) {
      console.error("Error obtaining the TIDAL client token:", error);
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
