export enum TileType {
  Simple = 0,
  Question = 1,
  Empty = 2,
}

export type TileLetter = {
  letter: string;
  solvedBy: string | null;
}

export type LetterOption = {
  letter: string;
  selected: boolean;
}