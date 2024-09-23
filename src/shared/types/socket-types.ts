import { Socket as _ServerSocket } from "socket.io";
import { Socket as _ClientSocket } from "socket.io-client";
import { InitialRoomData, PlayerData } from "./socket-data";
import { Room } from "@prisma/client";

export type ServerToClientEvents = {
  session: (data: SocketData) => void;
  joinedRoom: (socket: PlayerData) => void;
  leftRoom: (socketId: _ServerSocket["id"]) => void;
  setLetter: (socketId: _ServerSocket["id"], position: number, letter: string, success: boolean) => void;
  changedPlayerScore: (socketId: _ServerSocket["id"], score: number) => void;
}

export type ClientToServerEvents = {
  joinRoom: (roomId: Room["id"], callback: (room: InitialRoomData) => void) => void;
  leaveRoom: (roomId: Room["id"]) => void;
  setLetter: (position: number, letter: string) => void;
  setName: (name: string) => void;
}

export type SocketData = {
  socketId: _ServerSocket["id"];
  sessionId: string;
  userId: string;
  name: string;
}

export type ServerSocket = _ServerSocket<ClientToServerEvents, ServerToClientEvents, [], SocketData>;
export type ClientSocket = _ClientSocket<ServerToClientEvents, ClientToServerEvents>;