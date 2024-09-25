export type Session = {
  userId: string;
  name: string;
  gameProgress: GameProgress;
}

export type GameProgress = {
  level: number;
}