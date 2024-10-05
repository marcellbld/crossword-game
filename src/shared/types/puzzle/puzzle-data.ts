import { Tile, Question, BaseQuestion } from "@prisma/client";

type PuzzleData = {
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

export default PuzzleData;