"use client";
import axios from "axios";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const endpoint = import.meta.env.VITE_API_ENDPOINT;

interface AuthContextType {
  tidalClientToken: string | null;
  spotifyClientToken: string | null;
  fetchAndSetToken: () => Promise<void>;
  fetchAndSetSpotifyToken: () => Promise<void>;
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

  const fetchAndSetToken = useCallback(async () => {
    try {
      // Attempt to fetch the token from local storage
      const storedToken = localStorage.getItem("tidalToken");
      const tokenDetails = storedToken ? JSON.parse(storedToken) : null;

      const now = new Date();

      if (
        tokenDetails &&
        tokenDetails.expires &&
        new Date(tokenDetails.expires) > now
      ) {
        setTidalClientToken(tokenDetails.token);
      } else {
        // Token is expired or not present; fetch a new one
        const response = await axios.post(
          `${endpoint}/api/obtain-tidal-credentials`
        );
        const { access_token, expires_in } = response.data;

        const expires = new Date(
          now.getTime() + expires_in * 1000
        ).toISOString();

        localStorage.setItem(
          "tidalToken",
          JSON.stringify({ token: access_token, expires })
        );
        setTidalClientToken(access_token);
      }
    } catch (error) {
      console.error("Error obtaining the TIDAL client token:", error);
    }
  }, []);

  const fetchAndSetSpotifyToken = useCallback(async () => {
    try {
      // Attempt to fetch the Spotify token from local storage
      const storedToken = localStorage.getItem("spotifyToken");
      const tokenDetails = storedToken ? JSON.parse(storedToken) : null;

      const now = new Date();

      if (
        tokenDetails &&
        tokenDetails.expires &&
        new Date(tokenDetails.expires) > now
      ) {
        setSpotifyClientToken(tokenDetails.token);
      } else {
        // Token is expired or not present; fetch a new one
        const response = await axios.post(
          `${endpoint}/api/obtain-spotify-credentials`
        );
        const { access_token, expires_in } = response.data;

        const expires = new Date(
          now.getTime() + expires_in * 1000
        ).toISOString();

        localStorage.setItem(
          "spotifyToken",
          JSON.stringify({ token: access_token, expires })
        );
        setSpotifyClientToken(access_token);
      }
    } catch (error) {
      console.error("Error obtaining the Spotify client token:", error);
    }
  }, []);

  useEffect(() => {
    fetchAndSetToken();
    fetchAndSetSpotifyToken();
  }, [fetchAndSetToken, fetchAndSetSpotifyToken]);

  return (
    <AuthContext.Provider
      value={{
        tidalClientToken,
        spotifyClientToken,
        fetchAndSetToken,
        fetchAndSetSpotifyToken,
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
