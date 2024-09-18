import { Puzzle } from "@/lib/types/puzzle-types";
import { Socket } from "socket.io-client";
import { TileLetter, LetterOption } from "./tile";

export type PlayerData = {
  socketId: string;
  color: string;
  score: number;
}

export type InitialRoomData = {
  basePuzzle: Puzzle;
  progressBoard: {
    [k: number]: TileLetter;
  };
  players: PlayerData[];
  letterOptions: {
    [k: number]: LetterOption[];
  };
}

export type RoomData = Pick<InitialRoomData, "progressBoard" | "letterOptions" | "players">;

export type SetLetterSocketData = {
  position: number;
  letter: string;
}

export type SetLetterSocketCallbackData = {
  socketId: Socket["id"];
  position: number;
  letter: string;
  success: boolean;
}

export type PlayerScoreChangedData = {
  socketId: string;
  score: number;
}