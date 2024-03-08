import axios from "axios";
import { ClientSpotifyPlaylist } from "../../src/types/ClientSpotifyPlaylist";
import { StandardApiResponse } from "./obtainCredentials";
export const getSpotifyPlaylist = async (
  spotifyToken: string,
  playlistId: string
): Promise<StandardApiResponse<ClientSpotifyPlaylist>> => {
  if (!spotifyToken) {
    return { data: { error: "Must provide Spotify client token in header" } };
  }

  if (!playlistId) {
    return { data: { error: "Missing playlist ID" } };
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
    return { data };
  } catch (error) {
    console.error("Error fetching Spotify playlist:", error);
    return { data: { error: "Failed to fetch Spotify playlist" } };
  }
};
