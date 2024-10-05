import { UserProgress, Room } from "@prisma/client";
import { Player } from "../player";
import { InitialRoom } from "../room";
import SocketData from "./socket-data";

export type ServerToClientEvents = {
  session: (data: SocketData, userProgress: UserProgress | null) => void;
  joinedRoom: (socket: Player) => void;
  leftRoom: (userId: string) => void;
  setLetter: (userId: string, position: number, letter: string, success: boolean) => void;
  changedPlayerScore: (userId: string, score: number) => void;
  completedGame: () => void;
  nextGame: (data: InitialRoom) => void;
}

export type ClientToServerEvents = {
  joinRoom: (roomId: Room["id"], callback: (room: InitialRoom) => void) => void;
  leaveRoom: (roomId: Room["id"]) => void;
  playProgressGame: (callback: (room: InitialRoom, roomId: string) => void) => void;
  setLetter: (position: number, letter: string) => void;
  setName: (name: string) => void;
  nextGame: () => void;
}