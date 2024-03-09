import axios, { AxiosError } from "axios";
import { TidalPlaylist } from "../types/TidalPlaylist";
import { StandardApiResponse } from "./obtainCredentials";

export const convertSpotifyPlaylist = async (
  tidalToken: string,
  spotifyToken: string,
  playlistId: string,
  setProgress?: (progress: number) => void
): Promise<StandardApiResponse<TidalPlaylist>> => {
  if (!tidalToken) {
    return { data: { error: "Must provide TIDAL client token." } };
  }

  if (!spotifyToken) {
    return { data: { error: "Must provide Spotify client token." } };
  }

  if (!playlistId) {
    return { data: { error: "Missing playlist ID." } };
  }

  try {
    const spotifyResponse = await axios
      .get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
        },
      })
      .catch((error) => {
        throw new Error("SPOTIFY ERROR: " + error);
      });

    // Convert Spotify playlist to TIDAL playlist
    const tracks = spotifyResponse.data.tracks.items.map((item: any) => {
      return {
        title: item.track.name,
        artist: item.track.artists[0].name,
      };
    });

    let rateLimit = {
      requestCost: 0,
      remainingTokens: 0,
      replenishRate: 0,
    };
    let lastRequestCost = 0;
    for (let i = 0; i < tracks.length; i++) {
      if (setProgress) {
        setProgress((i / tracks.length) * 100);
      }
      const track = tracks[i];
      await new Promise((resolve) => {
        if (i === 0) {
          resolve(0);
          return;
        }
        const delay = (lastRequestCost / rateLimit.replenishRate) * 1000 + 50;
        console.log("Delay:", delay);
        setTimeout(resolve, delay);
      });

      const searchResponse = await axios
        .get("https://openapi.tidal.com/search", {
          headers: {
            Authorization: `Bearer ${tidalToken}`,
            "Content-Type": "application/vnd.tidal.v1+json",
          },
          params: {
            query: `${track.title} ${track.artist}`,
            countryCode: "GB",
            limit: 1,
          },
          data: {},
        })
        .then((response) => {
          rateLimit = {
            requestCost:
              rateLimit.requestCost +
              parseInt(response.headers["x-ratelimit-requested-tokens"]),
            remainingTokens: parseInt(
              response.headers["x-ratelimit-remaining"]
            ),
            replenishRate: parseInt(
              response.headers["x-ratelimit-replenish-rate"]
            ),
          };
          lastRequestCost = parseInt(
            response.headers["x-ratelimit-requested-tokens"]
          );
          return response;
        })
        .catch((error: AxiosError) => {
          console.error("TIDAL ERROR: " + error);
        });
      const tidalTrack = searchResponse?.data.tracks[0]?.resource;
      if (tidalTrack) {
        tracks[i] = tidalTrack;
      } else {
        console.log("No match found for", track.title);
        tracks[i] = null;
      }
    }

    const tidalPlaylist: TidalPlaylist = {
      type: "tidal",
      id: playlistId,
      name: spotifyResponse.data.name,
      description: spotifyResponse.data.description,
      owner: {
        displayName: spotifyResponse.data.owner.display_name,
      },
      images: spotifyResponse.data.images,
      duration: spotifyResponse.data.tracks.items
        .map((item: any) => {
          return item.track.duration_ms;
        })
        .reduce((a: number, b: number) => a + b, 0),
      followers: spotifyResponse.data.followers.total,
      tracks: tracks.map((track: any) => {
        if (!track) {
          return {
            id: "",
            title: "No match found",
            artist: "",
            album: "",
            albumCover: "",
            duration: 0,
            url: "",
          };
        }
        return {
          id: track.id,
          title: track.title,
          artist: track.artists.map((artist: any) => artist.name).join(", "),
          album: track.album.title,
          albumCover: track.album.imageCover[0].url,
          duration: track.duration,
          quality: track.mediaMetadata.tags,
          url: track.tidalUrl,
        };
      }),
    };

    console.log("Rate limit:", rateLimit);
    setProgress && setProgress(100);
    return { data: tidalPlaylist };
  } catch (error: any) {
    console.error("Error converting Spotify playlist:", error);
    return { data: { error: "Failed to convert Spotify playlist" } };
  }
};
