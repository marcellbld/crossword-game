import Tile from "./tile";
import { TileModel } from "@/lib/models/tile-model";
import { usePuzzleContext, useRoomContext } from "@/lib/hooks/hooks";
import { calculateDirection } from "@/lib/game-utils";
import { PlayerData, TileType } from "@/shared/types";
import { cn } from "@/lib/utils";

export default function GameBoard() {
  const { tiles, selectedTileId, setSelectedTileId, progressBoard } =
    usePuzzleContext();

  const { players } = useRoomContext();

  let selectedTiles: number[] = [];
  if (selectedTileId !== null && tiles != null) {
    const tile = tiles[selectedTileId];
    if (tile.type !== TileType.Empty) {
      selectedTiles = [selectedTileId];

      if (tile.type === TileType.Question) {
        const dir = calculateDirection(tile.direction![0]);

        let nextId = selectedTileId + dir;
        while (
          nextId >= 0 &&
          nextId < tiles.length &&
          tiles[nextId].type === TileType.Simple
        ) {
          selectedTiles.push(nextId);
          nextId += dir;
        }
      }
    }
  }

  const handleTileClick = (index: number) => {
    setSelectedTileId(index);
  };

  const createTile = (
    tileModel: TileModel,
    index: number,
    selected: boolean,
    solvedBy?: PlayerData | null
  ) => {
    return (
      <Tile
        onClick={() => handleTileClick(index)}
        key={index}
        tileModel={tileModel}
        className={cn(getTileRoundedClass(index))}
        selected={selected}
        solvedBy={solvedBy}
      />
    );
  };

  return (
    <div className="grid grid-cols-8 grid-rows-8 gap-[0.125rem] aspect-square">
      {tiles &&
        tiles.map((tile, index) => {
          const solvedBySocketId = progressBoard?.[index]?.solvedBy || null;
          const solvedBy = players.find(p => p.socketId === solvedBySocketId);

          return createTile(
            tile,
            index,
            selectedTiles.includes(index),
            solvedBy
          );
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
