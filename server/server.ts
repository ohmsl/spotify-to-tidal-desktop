import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import { createServer, Server as HTTPServer } from "http";
import { Socket, Server as SocketIOServer } from "socket.io";
import { convertSpotifyPlaylist } from "./handlers/convertSpotifyPlaylist";
import { getSpotifyPlaylist } from "./handlers/getSpotifyPlaylist";
import { obtainSpotifyCredentials } from "./handlers/obtainSpotifyCredentials";
import { obtainTidalCredentials } from "./handlers/obtainTidalCredentials";
import { search } from "./handlers/search";
import { attachIO } from "./middleware/attachIO";

dotenv.config();

const app: Express = express();
const server: HTTPServer = createServer(app);
const io: SocketIOServer = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const router = express.Router();

router.get("/ping", (req, res) => {
  res.send("pong");
});

// Auth
router.post("/api/obtain-tidal-credentials", obtainTidalCredentials);
router.post("/api/obtain-spotify-credentials", obtainSpotifyCredentials);

// Playlist
router.get("/api/get-spotify-playlist/:playlistId", getSpotifyPlaylist);
router.post(
  "/api/convert-spotify-playlist/:playlistId",
  convertSpotifyPlaylist
);

// Search
router.post("/api/search", search);

app.use(cors());
app.use(express.json());
app.use(attachIO(io));
app.use(router);

io.on("connection", (socket: Socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
