import { Socket as _ServerSocket } from "socket.io";
import { Socket as _ClientSocket } from "socket.io-client";
import { InitialRoomData, PlayerData } from "./socket-data";
import { Room, UserProgress } from "@prisma/client";

export type ServerToClientEvents = {
  session: (data: SocketData, userProgress: UserProgress | null) => void;
  joinedRoom: (socket: PlayerData) => void;
  leftRoom: (userId: string) => void;
  setLetter: (userId: string, position: number, letter: string, success: boolean) => void;
  changedPlayerScore: (userId: string, score: number) => void;
  completedGame: () => void;
  nextGame: (data: InitialRoomData) => void;
}

export type ClientToServerEvents = {
  joinRoom: (roomId: Room["id"], callback: (room: InitialRoomData) => void) => void;
  leaveRoom: (roomId: Room["id"]) => void;
  playProgressGame: (callback: (room: InitialRoomData, roomId: string) => void) => void;
  setLetter: (position: number, letter: string) => void;
  setName: (name: string) => void;
  nextGame: () => void;
}

export type SocketData = {
  socketId: _ServerSocket["id"];
  sessionId: string;
  userId: string;
  name: string;
}

export type ServerSocket = _ServerSocket<ClientToServerEvents, ServerToClientEvents, [], SocketData>;
export type ClientSocket = _ClientSocket<ServerToClientEvents, ClientToServerEvents>;