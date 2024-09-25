import { TileModel } from "@/lib/models/tile-model";
import { QuestionDirection } from "@/lib/types/question-types";
import { TileType } from "@/shared/types";
import { useState } from "react";

export const useCreatorTiles = () => {
  const [tiles, _setTiles] = useState<TileModel[]>(createEmptyTileModelArray());
  const [selectedTileId, _setSelectedTileId] = useState<number[] | null>(null);
  const [selectedDirection, _setSelectedDirection] = useState<null | QuestionDirection>(null);

  const selectTile = (id: number[] | null) => {
    _setSelectedTileId(id);

    if (!id) return;

    const tile = tiles?.[id[0]] ?? null;

    if (
      tile &&
      tile.type === TileType.Question
    ) {
      setSelectedDirection(tiles[id[0]].direction![id[1]], false);
    } else {
      setSelectedDirection(null, false);
    }
  };

  const setSelectedDirection = (
    direction: QuestionDirection | null,
    changeQuestion = true
  ) => {
    _setSelectedDirection(direction);

    if (!changeQuestion || !direction || !tiles || !selectedTileId) return;

    const tile = tiles[selectedTileId[0]] ?? null;

    if (tileHasBothQuestion(tile)) {
      _setSelectedTileId([selectedTileId[0], selectedTileId[1] === 1 ? 0 : 1]);
    }
  };

  const resetTiles = () => {
    _setTiles(createEmptyTileModelArray());
  };

  const setTile = (id: number, tile: TileModel) => {
    _setTiles(prev => {
      const newTiles = [...prev];
      newTiles[id] = tile;

      return newTiles;
    });
  }

  const setTiles = (indexes: number[], tiles: TileModel[]) => {
    _setTiles(prev => prev.map((tile, index) => {
      if (indexes.includes(index)) {
        return tiles[indexes.indexOf(index)];
      }

      return tile;
    }));
  }

  return { tiles, setTile, setTiles, selectTile, selectedTileId, selectedDirection, setSelectedDirection, resetTiles }
}

const tileHasBothQuestion = (tile: TileModel): boolean => {
  return tile.type === TileType.Question &&
    tile.content!.length > 0;
}

const createEmptyTileModelArray = () => {
  return Array.from({ length: 64 }).map(
    () => new TileModel({ type: TileType.Empty })
  );
}
