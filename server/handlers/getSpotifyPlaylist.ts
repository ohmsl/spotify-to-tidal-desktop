import axios from "axios";
import express from "express";
import { ClientSpotifyPlaylist } from "../../src/types/ClientSpotifyPlaylist";

export const getSpotifyPlaylist: (
  req: express.Request,
  res: express.Response
) => Promise<void> = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const spotifyToken = req.headers["x-spotify-client-token"];
  if (!spotifyToken) {
    res
      .status(401)
      .json({ error: "Must provide Spotify client token in header" });
    return;
  }

  const playlistId = req.params.playlistId;
  if (!playlistId) {
    res.status(400).json({ error: "Missing playlist ID" });
    return;
  }

  const headers = {
    Authorization: `Bearer ${spotifyToken}`,
  };

  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers,
      }
    );

    const data: ClientSpotifyPlaylist = {
      type: "spotify",
      id: response.data.id,
      name: response.data.name,
      description: response.data.description,
      duration: response.data.tracks.items
        .map((item: any) => {
          return item.track.duration_ms;
        })
        .reduce((a: number, b: number) => a + b, 0),
      owner: {
        displayName: response.data.owner.display_name,
      },
      followers: response.data.followers.total,
      images: response.data.images,
      tracks: response.data.tracks.items.map((item: any) => {
        return {
          title: item.track.name,
          artist: item.track.artists[0].name,
          album: item.track.album.name,
          duration: item.track.duration_ms,
        };
      }),
    };

    console.log("Spotify playlist:", response);
    res.status(200).json(data);
  } catch (error: any) {
    console.error("Error fetching Spotify playlist:", error.response.data);
    res.status(500).json({ error: "Failed to obtain playlist" });
  }
};
