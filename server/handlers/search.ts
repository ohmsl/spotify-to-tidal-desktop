import axios from "axios";
import express from "express";

// must type everything and DO NOT use any
export const search: (
  req: express.Request,
  res: express.Response
) => Promise<void> = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const token = req.headers["x-tidal-client-token"];
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const query = req.body.query;
  if (!query) {
    res.status(400).json({ error: "Missing search query" });
    return;
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/vnd.tidal.v1+json",
  };

  try {
    const response = await axios.get("https://openapi.tidal.com/search", {
      headers,
      params: { query, countryCode: "GB", limit: 1 },
    });
    console.log("TIDAL search response:", response.data);
    res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Error fetching TIDAL search results:", error.response.data);
    res.status(500).json({ error: "Failed to obtain search results" });
  }
};
