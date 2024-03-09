import React, { createContext, useState } from "react";
import { SpotifyPlaylist } from "../types/SpotifyPlaylist";
import { TidalPlaylist } from "../types/TidalPlaylist";

// Define the context type
interface ConversionContextType {
  spotifyPlaylist: SpotifyPlaylist | undefined;
  tidalPlaylist: TidalPlaylist | undefined;
  setSpotifyPlaylist: (playlist: SpotifyPlaylist) => void;
  setTidalPlaylist: (playlist: TidalPlaylist) => void;
}

// Create the context
const ConversionContext = createContext<ConversionContextType>({
  spotifyPlaylist: undefined,
  tidalPlaylist: undefined,
  setSpotifyPlaylist: () => {},
  setTidalPlaylist: () => {},
});

// Create the provider component
const ConversionProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const { children } = props;
  const [spotifyPlaylist, setSpotifyPlaylist] = useState<SpotifyPlaylist>();
  const [tidalPlaylist, setTidalPlaylist] = useState<TidalPlaylist>();

  return (
    <ConversionContext.Provider
      value={{
        spotifyPlaylist,
        tidalPlaylist,
        setSpotifyPlaylist,
        setTidalPlaylist,
      }}
    >
      {children}
    </ConversionContext.Provider>
  );
};

export { ConversionContext, ConversionProvider };
