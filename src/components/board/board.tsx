"use client";

import { TileModel } from "@/lib/models/tile-model";
import { cn } from "@/lib/utils";
import { Player } from "@/shared/types/player";
import { TileType } from "@/shared/types/tile";
import Tile from "../../app/room/[id]/(components)/tile";

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
  handleSolvedBy: (index: number) => Player | null;
}) {
  const createTile = (
    tileModel: TileModel,
    index: number,
    solvedBy?: Player | null
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
