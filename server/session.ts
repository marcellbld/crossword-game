import { GameProgress } from "./game-progress";

export type Session = {
  userId: string;
  name: string;
  gameProgress: GameProgress;
}