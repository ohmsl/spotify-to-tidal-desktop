import { NextFunction, Request, Response } from "express";
import { Server as SocketIOServer } from "socket.io";

export const attachIO = (io: SocketIOServer) => {
  return (req: Request, res: Response, next: NextFunction) => {
    (req as any).io = io;
    next();
  };
};
