export type SpotifyTrack = {
  title: string;
  artist: string;
  album: string;
  duration: number;
};

export type SpotifyPlaylist = {
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
  tracks: Array<SpotifyTrack>;
};
