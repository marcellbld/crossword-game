"use client";

import { QuestionDirection } from "@/shared/types/question";
import { getBaseQuestions as fetchBaseQuestions } from "@/actions/base-question-actions";
import { TileModel } from "@/lib/models/tile-model";
import { BaseQuestion, Room } from "@prisma/client";
import { createContext } from "react";
import {
  QuestionTemplate,
  useCreatorQuestionTemplates,
} from "@/lib/hooks/creator/use-creator-question-templates";
import { useCreatorTiles } from "@/lib/hooks/creator/use-creator-tiles";
import { useCreatorQuestions } from "@/lib/hooks/creator/use-creator-questions";
import { TileType } from "@/shared/types/tile";
import CreatePuzzle from "@/lib/models/create-puzzle";
import { createPuzzle } from "@/actions/puzzle-actions";
import { createGame as createGameAction } from "@/actions/game-actions";

type TCreatorContext = {
  tiles: TileModel[] | null;
  selectedTileId: number[] | null;
  selectTile: (id: number[] | null) => void;
  selectedDirection: QuestionDirection | null;
  setSelectedDirection: (direction: QuestionDirection | null) => void;
  resetTiles: () => void;
  addSecondQuestion: () => void;
  deleteQuestion: () => void;
  setQuestion: (question: BaseQuestion, direction: QuestionDirection) => void;
  getBaseQuestions: (
    maxLength: number,
    characters: string[]
  ) => Promise<BaseQuestion[]>;
  questionTemplates: (QuestionTemplate | undefined)[][];
  createGame: () => Promise<Room | undefined>;
  createJson: () => Promise<string>;
};

export const CreatorContext = createContext<TCreatorContext | null>(null);

export default function CreatorContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    tiles,
    setTile,
    setTiles,
    selectTile,
    selectedTileId,
    selectedDirection,
    setSelectedDirection,
    resetTiles,
  } = useCreatorTiles();
  const {
    questionTemplates,
    addQuestionTemplate,
    switchQuestionTemplate,
    deleteQuestionTemplate,
  } = useCreatorQuestionTemplates();
  const { addSecondQuestion, deleteQuestion, setQuestion } =
    useCreatorQuestions(
      tiles,
      setTile,
      setTiles,
      selectedTileId,
      selectTile,
      setSelectedDirection,
      questionTemplates,
      addQuestionTemplate,
      switchQuestionTemplate,
      deleteQuestionTemplate
    );

  const getBaseQuestions = async (maxLength: number, characters: string[]) => {
    const ignoreQuestions = questionTemplates
      .flatMap(qt => qt.flatMap(q => q?.baseQuestion.id))
      .filter(q => q !== undefined);

    return await fetchBaseQuestions(maxLength, characters, ignoreQuestions);
  };

  const createGame = async () => {
    const puzzle = {
      id: undefined,
      tiles: await createCreatePuzzle(),
    };

    const createdPuzzle = await createPuzzle(puzzle);
    return createGameAction(createdPuzzle.id, false, 2);
  };

  const createCreatePuzzle = async (): Promise<CreatePuzzle["tiles"][0][]> => {
    return questionTemplates
      .map((row, i) => {
        if (tiles![i].type === TileType.Simple) return undefined;

        const modifiedRow = row?.filter(qt => !!qt);

        return {
          position: i,
          type: modifiedRow.length === 0 ? "empty" : "question",
          questions:
            modifiedRow.length === 0
              ? undefined
              : row.map(qt =>
                  qt === undefined || qt === null
                    ? undefined
                    : {
                        direction:
                          qt.direction === QuestionDirection.Right
                            ? "right"
                            : "bottom",
                        baseQuestion: qt.baseQuestion.id,
                      }
                ),
        } as CreatePuzzle["tiles"][0];
      })
      .filter(item => !!item);
  };

  const createJson = async () => {
    return JSON.stringify(await createCreatePuzzle(), null, 2);
  };

  return (
    <CreatorContext.Provider
      value={{
        tiles,
        selectedTileId,
        selectTile,
        selectedDirection,
        setSelectedDirection,
        resetTiles,
        addSecondQuestion,
        deleteQuestion,
        setQuestion,
        getBaseQuestions,
        questionTemplates,
        createGame,
        createJson,
      }}
    >
      {children}
    </CreatorContext.Provider>
  );
}
