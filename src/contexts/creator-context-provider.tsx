"use client";

import { QuestionDirection } from "@/shared/types/question";
import { getBaseQuestions as fetchBaseQuestions } from "@/actions/base-question-actions";
import { TileModel } from "@/lib/models/tile-model";
import { BaseQuestion } from "@prisma/client";
import { createContext } from "react";
import {
  QuestionTemplate,
  useCreatorQuestionTemplates,
} from "@/lib/hooks/creator/use-creator-question-templates";
import { useCreatorTiles } from "@/lib/hooks/creator/use-creator-tiles";
import { useCreatorQuestions } from "@/lib/hooks/creator/use-creator-questions";

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
      }}
    >
      {children}
    </CreatorContext.Provider>
  );
}
