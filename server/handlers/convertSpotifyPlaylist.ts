import axios, { AxiosError } from "axios";
import express from "express";
import { Socket } from "socket.io";
import { TidalPlaylist } from "../../src/types/TidalPlaylist";

export const convertSpotifyPlaylist: (
  req: express.Request,
  res: express.Response
) => Promise<void> = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const io: Socket = (req as any).io;

  const tidalToken = req.headers["x-tidal-client-token"];
  if (!tidalToken) {
    res
      .status(401)
      .json({ error: "Must provide TIDAL client token in header" });
    return;
  }

  const spotifyToken = req.headers["x-spotify-client-token"];
  if (!spotifyToken) {
    console.log("missing spotify token");
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
      const track = tracks[i];
      await new Promise((resolve) => {
        // calculate delay based on rate limit
        const delay = (lastRequestCost / rateLimit.replenishRate) * 1000 + 10;
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
          res
            .status(error.response?.status || 500)
            .send(error.response?.statusText);
          throw new Error(`TIDAL ERROR: ${error.code} ${error.message}`);
        });
      const tidalTrack = searchResponse.data.tracks[0]?.resource;
      if (tidalTrack) {
        tracks[i] = tidalTrack;
      } else {
        console.log("No match found for", track.title);
        tracks[i] = null;
      }
      io.emit("loading", {
        progress: Math.round(((i + 1) / tracks.length) * 100),
        message: `Converting track ${i + 1} of ${tracks.length}`,
      });

      if (io.disconnected) {
        return;
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
          url: track.tidalUrl,
        };
      }),
    };

    console.log("Rate limit:", rateLimit);
    res.status(200).json(tidalPlaylist);
  } catch (error: any) {
    console.error(error.message);
  }
};
