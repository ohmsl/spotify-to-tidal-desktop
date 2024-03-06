// due to API limitations as of Feb 2024, we can't create a playlist, so we must settle for an array of tracks
export type ClientTidalPlaylist = {
  type: "spotify" | "tidal";
  id: string;
  name: string;
  description: string;
  duration: number;
  owner: {
    displayName: string;
  };
  followers: number;
  images: Array<{
    width: number | null;
    height: number | null;
    url: string;
  }>;
  tracks: Array<{
    id: string;
    title: string;
    artist: string;
    album: string;
    albumCover: string;
    duration: number;
    quality: Array<"LOSSLESS" | "MQA" | "HIRES_LOSSLESS">;
    url: string;
  }>;
};
