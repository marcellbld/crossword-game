import { Puzzle } from "@/lib/types/puzzle-types";
import { TileLetter, LetterOption } from "./tile";
import { SocketData } from "./socket-types";

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

export type PlayerData = Omit<SocketData, "socketId" | "sessionId"> & {
  color: string;
  score: number;
}
