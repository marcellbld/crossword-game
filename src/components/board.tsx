"use client";

import Tile from "../app/room/[id]/(components)/tile";
import { TileModel } from "@/lib/models/tile-model";
import { PlayerData, TileType } from "@/shared/types";
import { cn } from "@/lib/utils";

export default function Board({
  tiles,
  handleTileClick,
  handleIsSelected,
  handleSolvedBy,
}: {
  tiles: TileModel[];
  handleTileClick: (index: number, itemId: number) => void;
  handleIsSelected: (
    index: number,
    itemId: number,
    tileType: TileType
  ) => boolean;
  handleSolvedBy: (index: number) => PlayerData | null;
}) {
  const createTile = (
    tileModel: TileModel,
    index: number,
    solvedBy?: PlayerData | null
  ) => {
    return (
      <Tile
        index={index}
        key={index}
        tileModel={tileModel}
        className={cn(getTileRoundedClass(index))}
        solvedBy={solvedBy}
        handleClick={handleTileClick}
        isSelected={handleIsSelected}
      />
    );
  };

  return (
    <div className="grid grid-cols-8 grid-rows-8 gap-[0.125rem] aspect-square">
      {tiles &&
        tiles.map((tile, index) => {
          return createTile(tile, index, handleSolvedBy(index));
        })}
    </div>
  );
}

function getTileRoundedClass(index: number) {
  switch (index) {
    case 0:
      return `rounded-tl-lg`;
    case 7:
      return `rounded-tr-lg`;
    case 56:
      return `rounded-bl-lg`;
    case 63:
      return `rounded-br-lg`;
    default:
      return "";
  }
}
