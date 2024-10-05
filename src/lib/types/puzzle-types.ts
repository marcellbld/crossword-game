import { BaseQuestion, Question, Tile } from "@prisma/client";

export type PuzzleData = {
  Tiles: {
    position: Tile["position"];
    type: Tile["type"];
    Questions: {
      direction: Question["direction"];
      BaseQuestion: {
        type: BaseQuestion["type"];
        content: BaseQuestion["content"];
        answer: BaseQuestion["answer"];
      };
    }[];
  }[];
}