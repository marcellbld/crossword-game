import Board from "@/components/board/board";
import { usePuzzleContext, useRoomContext } from "@/lib/hooks/context-hooks";
import { TileType } from "@/shared/types";

export default function GameBoard() {
  const {
    tiles,
    progressBoard,
    setSelectedTileId,
    selectedTileId,
    getSelectedTiles,
  } = usePuzzleContext();

  const { players } = useRoomContext();

  const isSelected = (index: number, itemId: number, tileType: TileType) => {
    if (tileType === TileType.Question) {
      return selectedTileId?.[0] === index && selectedTileId?.[1] === itemId;
    }

    return getSelectedTiles().includes(index);
  };

  const handleClick = (index: number, itemId: number) => {
    setSelectedTileId([index, itemId ?? 0]);
  };

  const handleSolvedBy = (index: number) => {
    const solvedByUserId = progressBoard?.[index]?.solvedBy || null;
    const solvedBy = players.find(p => p.userId === solvedByUserId);

    return solvedBy ?? null;
  };

  return (
    <>
      {tiles && (
        <Board
          tiles={tiles}
          handleTileClick={handleClick}
          handleIsSelected={isSelected}
          handleSolvedBy={handleSolvedBy}
        />
      )}
    </>
  );
}
