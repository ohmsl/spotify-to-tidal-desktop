import axios from "axios";
import express from "express";

export const obtainSpotifyCredentials: (
  req: express.Request,
  res: express.Response
) => Promise<void> = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const clientId =
    process.env.SPOTIFY_CLIENT_ID || "863e24af8a564085a77e7d75bb104a78";
  const clientSecret =
    process.env.SPOTIFY_CLIENT_SECRET || "c827cb964b2e4236a83024a0ea4e2e89";
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("Served Spotify access token:", response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching Spotify access token:", error);
    res.status(500).json({ error: "Failed to obtain access token" });
  }
};
