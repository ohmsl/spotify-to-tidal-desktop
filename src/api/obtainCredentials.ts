import axios from "axios";

export type StandardApiResponse<T> = {
  data: T | { error: string };
};

export const obtainCredentials = async (
  tidalClientId: string,
  tidalClientSecret: string,
  spotifyClientId: string,
  spotifyClientSecret: string
): Promise<
  StandardApiResponse<{
    tidalResponse: { access_token: string; expires_in: number };
    spotifyResponse: { access_token: string; expires_in: number };
  }>
> => {
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
      return { data: { error: error.response.data.error_description } };
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
      return { data: { error: error.response.data.error } };
    });

  return {
    data: {
      tidalResponse: tidalResponse.data,
      spotifyResponse: spotifyResponse.data,
    },
  };
};
