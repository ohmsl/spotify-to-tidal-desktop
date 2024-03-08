import axios from "axios";

export type StandardApiResponse<T> = {
  data: T | { error: string };
};

export const obtainCredentials = async (): Promise<
  StandardApiResponse<{
    tidalResponse: { access_token: string; expires_in: number };
    spotifyResponse: { access_token: string; expires_in: number };
  }>
> => {
  const tidalClientId = import.meta.env.VITE_TIDAL_CLIENT_ID;
  const tidalClientSecret = import.meta.env.VITE_TIDAL_CLIENT_SECRET;
  const spotifyClientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const spotifyClientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

  const tidalCredentials = btoa(`${tidalClientId}:${tidalClientSecret}`);
  const spotifyCredentials = btoa(`${spotifyClientId}:${spotifyClientSecret}`);

  const tidalResponse = await axios
    .post(
      "https://auth.tidal.com/v1/oauth2/token",
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${tidalCredentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
    .catch((error) => {
      console.error("Error fetching TIDAL access token:", error);
      return { data: { error: "Failed to obtain access token" } };
    });

  const spotifyResponse = await axios
    .post(
      "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${spotifyCredentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
    .catch((error) => {
      console.error("Error fetching Spotify access token:", error);
      return { data: { error: "Failed to obtain access token" } };
    });

  return {
    data: {
      tidalResponse: tidalResponse.data,
      spotifyResponse: spotifyResponse.data,
    },
  };
};
