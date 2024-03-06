import axios from "axios";
import { Response } from "express";

export const obtainTidalCredentials: (
  req: any,
  res: Response
) => Promise<void> = async (req: Request, res: Response): Promise<void> => {
  const clientId = process.env.TIDAL_CLIENT_ID || "QXk76Uni13Unti2P";
  const clientSecret =
    process.env.TIDAL_CLIENT_SECRET ||
    "4wj49q4zwy8zjK6iBBM3F10dEOqhmIEXiWEIDmpFnYk";

  // Encode client ID and client secret in base64 for the Authorization header
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  try {
    const response = await axios.post(
      "https://auth.tidal.com/v1/oauth2/token",
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Send the access token back to the client
    console.log("Served TIDAL access token:", response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching TIDAL access token:", error);
    res.status(500).json({ error: "Failed to obtain access token" });
  }
};
