"use client";

import { TileModel } from "@/lib/models/tile-model";
import { TileType } from "@/shared/types";
import { InitialRoomData, SetLetterSocketCallbackData } from "@/shared/types";
import { createContext, useState } from "react";

type TPuzzleContext = {
  tiles: TileModel[] | null;
  letterOptions: InitialRoomData["letterOptions"] | null;
  progressBoard: InitialRoomData["progressBoard"] | null;
  selectedTileId: number | null;
  setSelectedTileId: (id: number | null) => void;
  setLetter: (data: SetLetterSocketCallbackData) => void;
  setupInitials: (
    data: Pick<
      InitialRoomData,
      "basePuzzle" | "letterOptions" | "progressBoard"
    >
  ) => void;
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

  const [selectedTileId, setSelectedTileId] = useState<number | null>(null);

  const setupInitials = ({
    basePuzzle,
    letterOptions,
    progressBoard,
  }: Pick<
    InitialRoomData,
    "basePuzzle" | "letterOptions" | "progressBoard"
  >): void => {
    setLetterOptions(letterOptions);
    setProgressBoard(progressBoard);

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

    setTiles(map);
  };

  const setLetter = ({
    socketId,
    position,
    letter,
    success,
  }: SetLetterSocketCallbackData) => {
    setLetterOptions(prev => ({
      ...prev,
      [position]: [
        ...prev![position].map(o =>
          o.letter === letter ? { letter, selected: true } : o
        ),
      ],
    }));
    // setLetterOptions(prev =>
    //   Object.fromEntries(
    //     Object.entries(prev!).map(([key, value]) => {
    //       const numKey = Number(key);
    //       if (numKey === position) {
    //         return [
    //           numKey,
    //           value.map(o =>
    //             o.letter === letter ? { letter, selected: true } : o
    //           ),
    //         ];
    //       }
    //       return [numKey, value];
    //     })
    //   )
    // );

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
        letterOptions,
        setLetter,
        setupInitials,
      }}
    >
      {children}
    </PuzzleContext.Provider>
  );
}
