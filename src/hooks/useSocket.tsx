import axios from "axios";
import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

/**
 * @param url - The URL to connect to the server.
 * @returns The socket instance.
 */
export const useSocket = (url: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    axios.post(url);
    const socketIo = io();

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, [url]);

  return socket;
};
