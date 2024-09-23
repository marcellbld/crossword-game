"use client";

import Tile from "./tile";
import { TileModel } from "@/lib/models/tile-model";
import { usePuzzleContext, useRoomContext } from "@/lib/hooks/hooks";
import { PlayerData } from "@/shared/types";
import { cn } from "@/lib/utils";

export default function GameBoard({ tiles }: { tiles: TileModel[] }) {
  const { progressBoard } = usePuzzleContext();

  const { players } = useRoomContext();

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
      />
    );
  };

  return (
    <div className="grid grid-cols-8 grid-rows-8 gap-[0.125rem] aspect-square">
      {tiles &&
        tiles.map((tile, index) => {
          const solvedByUserId = progressBoard?.[index]?.solvedBy || null;
          const solvedBy = players.find(p => p.userId === solvedByUserId);

          return createTile(tile, index, solvedBy);
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
