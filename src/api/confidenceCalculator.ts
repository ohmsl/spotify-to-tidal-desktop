import { SpotifyTrack } from "../types/SpotifyPlaylist";
import { TidalTrack } from "../types/TidalPlaylist";

const calculateMatchConfidence = (
  spotifyTrack: SpotifyTrack,
  tidalTrack: TidalTrack
): number => {
  let score = 0;

  // Calculate title similarity
  score += stringSimilarity(spotifyTrack.title, tidalTrack.title) * 40;

  // Calculate artist similarity
  score += stringSimilarity(spotifyTrack.artist, tidalTrack.artist) * 30;

  // Calculate album similarity
  score += stringSimilarity(spotifyTrack.album, tidalTrack.album) * 20;

  // Calculate duration similarity
  const durationDifference = Math.abs(
    spotifyTrack.duration - tidalTrack.duration
  );
  // Assuming a tolerance of 5 seconds (5000 milliseconds)
  if (durationDifference <= 5000) score += (1 - durationDifference / 5000) * 10;

  return Number(score.toFixed(0));
};

// Basic implementation of a string similarity function (for demonstration)
// In practice, use a more sophisticated method/library for better accuracy.
function stringSimilarity(str1: string, str2: string): number {
  str1 = str1.toLowerCase();
  str2 = str2.toLowerCase();
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  const longerLength = longer.length;
  if (longerLength === 0) {
    return 1.0;
  }
  const lengthDifference = longerLength - shorter.length;
  const editDistance = levenshteinDistance(str1, str2);
  return (longerLength - editDistance - lengthDifference / 2) / longerLength;
}

// Levenshtein Distance for calculating edit distance between two strings
function levenshteinDistance(s: string, t: string): number {
  if (!s.length) return t.length;
  if (!t.length) return s.length;

  const arr: number[][] = [];

  for (let i = 0; i <= s.length; i++) {
    arr[i] = [i];
  }

  for (let j = 1; j <= t.length; j++) {
    arr[0][j] = j;
  }

  for (let i = 1; i <= s.length; i++) {
    for (let j = 1; j <= t.length; j++) {
      arr[i][j] =
        s[i - 1] === t[j - 1]
          ? arr[i - 1][j - 1]
          : Math.min(
              arr[i - 1][j] + 1,
              arr[i][j - 1] + 1,
              arr[i - 1][j - 1] + 1
            );
    }
  }

  return arr[s.length][t.length];
}

export default calculateMatchConfidence;
