import { LetterOption, TileLetter, TileType } from "../src/shared/types";
import { Puzzle } from "../src/lib/types/puzzle-types";
import { calculateDirection } from "../src/lib/game-utils";

const LETTERS = "abcdefghijklmnopqrstuvwxyz";
export const calculateLetterOptions = (letter: string): LetterOption[] => {

  const shuffledLetters = [...LETTERS.split("")].filter(l => l !== letter).sort(() => 0.5 - Math.random());
  const letters = [letter, ...shuffledLetters.slice(0, 5)].sort(() => 0.5 - Math.random());

  return letters.map(l => ({ letter: l, selected: false }));
}

export const calculatePuzzle = (puzzle: Puzzle): Map<number, TileLetter> => {
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