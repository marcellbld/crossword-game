import { Player } from "../player";
import { PuzzleData } from "../puzzle";
import { TileLetter, TileLetterOption } from "../tile";

type InitialRoom = {
  basePuzzle: PuzzleData;
  progressBoard: {
    [k: number]: TileLetter;
  };
  playerCapacity: number;
  progressGame: boolean;
  players: Player[];
  letterOptions: {
    [k: number]: TileLetterOption[];
  };
}

export default InitialRoom;