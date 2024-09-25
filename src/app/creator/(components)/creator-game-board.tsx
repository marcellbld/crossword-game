import Board from "@/components/board";
import { useCreatorContext } from "@/lib/hooks/hooks";
import React from "react";

export default function CreatorGameBoard() {
  const { tiles, selectedTileId, selectTile } = useCreatorContext();

  const handleTileClick = (index: number, itemId: number) => {
    selectTile([index, itemId]);
  };

  const handleIsSelected = (index: number, itemId: number) => {
    return selectedTileId?.[0] === index && selectedTileId?.[1] === itemId;
  };

  const handleSolvedBy = () => {
    return null;
  };

  return (
    <>
      {tiles && (
        <Board
          tiles={tiles}
          handleTileClick={handleTileClick}
          handleIsSelected={handleIsSelected}
          handleSolvedBy={handleSolvedBy}
        />
      )}
    </>
  );
}
