import { QuestionDirection } from "./types/question-types";

export const calculateDirection = (direction: number | QuestionDirection): number => {
  switch (direction) {
    case QuestionDirection.Top:
      return -8;
    case QuestionDirection.Right:
      return 1
    case QuestionDirection.Bottom:
      return 8
    case QuestionDirection.Left:
      return -1;
    default:
      throw new Error("Invalid direction");
  }
}