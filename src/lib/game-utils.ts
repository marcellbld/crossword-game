import { QuestionDirection } from "@/shared/types/question";

export const calculateDirection = (direction: number | QuestionDirection): number => {
  switch (direction) {
    case QuestionDirection.Right:
      return 1;
    case QuestionDirection.Bottom:
      return 8;
    default:
      throw new Error("Invalid direction");
  }
}

export const calculateAnswerTiles = (startPosition: number, direction: QuestionDirection, length: number): number[] => {
  const dir = calculateDirection(direction);
  return Array.from({
    length: length,
  }).map((_, id) => startPosition + (id + 1) * dir);
}

export const calculateBlockPosition = (startPosition: number, direction: QuestionDirection, length: number): number | null => {
  const blockPosition = startPosition + calculateDirection(direction) * (length + 1);

  const isHorizontal = direction === QuestionDirection.Right;
  const blockPositionOverflow = isHorizontal && Math.floor(startPosition / 8) !== Math.floor(blockPosition / 8);

  if (blockPosition >= 64 || blockPositionOverflow)
    return null;

  return blockPosition;
}