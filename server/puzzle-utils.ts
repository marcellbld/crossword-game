import { TileLetterOption, TileLetter, TileType } from "@/shared/types/tile";
import { PuzzleData } from "@/shared/types/puzzle";
import { calculateDirection } from "@/lib/game-utils";
import { ALPHABET, shuffleArray } from "@/lib/utils";

function getShuffledLetters(ignoredLetter: string): string[] {
  return shuffleArray([...ALPHABET.split("")].filter(l => l !== ignoredLetter));
}

export const calculateLetterOptions = (letter: string): TileLetterOption[] => {
  const shuffledLetters = getShuffledLetters(letter);
  const letters = shuffleArray([letter, ...shuffledLetters.slice(0, 5)]);

  return letters.map(l => ({ letter: l, selected: false }));
}

export const calculatePuzzle = (puzzle: PuzzleData): Map<number, TileLetter> => {
  const map: Map<number, TileLetter> = new Map();

  puzzle.Tiles.forEach(tile => {
    if (tile.type === TileType.Question) {
      tile.Questions.forEach(question => {
        const dir = calculateDirection(question.direction);
        const baseQuestion = question.BaseQuestion;

        for (let i = 0; i < baseQuestion.answer.length; i++) {
          map.set(tile.position + (i + 1) * dir, { letter: baseQuestion.answer[i].toLowerCase(), solvedBy: null });
        }
      });
    }
  });

  return map;
}