"use client";

import { calculateDirection } from "@/lib/game-utils";
import { TileModel } from "@/lib/models/tile-model";
import { TileType } from "@/shared/types";
import { InitialRoomData } from "@/shared/types";
import { createContext, useState } from "react";

type TPuzzleContext = {
  tiles: TileModel[] | null;
  letterOptions: InitialRoomData["letterOptions"] | null;
  progressBoard: InitialRoomData["progressBoard"] | null;
  selectedTileId: number[] | null;
  setSelectedTileId: (id: number[] | null) => void;
  getSelectedTiles: () => number[];
  setLetter: (
    socketId: string,
    position: number,
    letter: string,
    success: boolean
  ) => void;
  setupInitials: (
    data: Pick<
      InitialRoomData,
      "basePuzzle" | "letterOptions" | "progressBoard"
    >
  ) => void;
  isCompleted: boolean;
  setCompleted: (completed: boolean) => void;
};

export const PuzzleContext = createContext<TPuzzleContext | null>(null);

export default function PuzzleContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [letterOptions, setLetterOptions] = useState<
    InitialRoomData["letterOptions"] | null
  >(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [progressBoard, setProgressBoard] = useState<
    InitialRoomData["progressBoard"] | null
  >(null);
  //const [basePuzzle, setBasePuzzle] = useState(initialData.basePuzzle);

  const [tiles, setTiles] = useState<TileModel[] | null>(null);
  // setupInitials(initialData.basePuzzle, initialData.progressBoard)

  const [selectedTileId, setSelectedTileId] = useState<number[] | null>(null);

  const [isCompleted, setCompleted] = useState<boolean>(false);

  const getSelectedTiles = () => {
    let selectedTiles: number[] = [];
    if (selectedTileId !== null && tiles != null) {
      const tile = tiles[selectedTileId[0]];
      if (tile.type !== TileType.Empty) {
        selectedTiles = [selectedTileId[0]];

        if (tile.type === TileType.Question) {
          const dir = calculateDirection(tile.direction![selectedTileId[1]]);

          let nextId = selectedTileId[0] + dir;
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

    return selectedTiles;
  };

  const setupInitials = ({
    basePuzzle,
    letterOptions,
    progressBoard,
  }: Pick<
    InitialRoomData,
    "basePuzzle" | "letterOptions" | "progressBoard"
  >): void => {
    setLetterOptions(() => letterOptions);
    setProgressBoard(() => progressBoard);
    setCompleted(false);

    const map = Array.from({ length: 64 }).map(
      () => new TileModel({ type: TileType.Simple })
    );

    for (const tile of basePuzzle.Tiles) {
      if (tile.type === TileType.Question) {
        const questions = [];
        const directions = [];
        const questionTypes = [];

        for (const question of tile.Questions) {
          questions.push(question.BaseQuestion.content);
          directions.push(question.direction);
          questionTypes.push(question.BaseQuestion.type);
        }

        map[tile.position] = new TileModel({
          type: tile.type,
          questionType: questionTypes,
          content: questions,
          direction: directions,
        });
      } else if (tile.type === TileType.Empty) {
        map[tile.position] = new TileModel({
          type: tile.type,
        });
      }
    }

    for (const [position, { letter }] of Object.entries(progressBoard)) {
      map[Number(position)] = new TileModel({
        type: TileType.Simple,
        content: [letter],
      });
    }

    setTiles(() => [...map]);
  };

  const setLetter = (
    socketId: string,
    position: number,
    letter: string,
    success: boolean
  ) => {
    setLetterOptions(prev => ({
      ...prev,
      [position]: [
        ...prev![position].map(o =>
          o.letter === letter ? { letter, selected: true } : o
        ),
      ],
    }));

    if (success) {
      setProgressBoard(prev => ({
        ...prev,
        [position]: {
          letter,
          solvedBy: socketId ?? null,
        },
      }));

      setTiles(prev => [
        ...prev!.map((tile, index) =>
          index !== position
            ? tile
            : new TileModel({ type: TileType.Simple, content: [letter] })
        ),
      ]);
    }
  };

  return (
    <PuzzleContext.Provider
      value={{
        tiles,
        progressBoard,
        selectedTileId,
        setSelectedTileId,
        getSelectedTiles,
        letterOptions,
        setLetter,
        setupInitials,
        isCompleted,
        setCompleted,
      }}
    >
      {children}
    </PuzzleContext.Provider>
  );
}
