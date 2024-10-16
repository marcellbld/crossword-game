import { calculateAnswerTiles, calculateBlockPosition } from "@/lib/game-utils";
import { TileModel } from "@/lib/models/tile-model";
import { BaseQuestion } from "@prisma/client";
import { useState } from "react";
import { QuestionTemplate } from "./use-creator-question-templates";
import { QuestionDirection, QuestionType } from "@/shared/types/question";
import { TileType } from "@/shared/types/tile";

type SimpleTemplate = {
  dependencies: number[];
};

export const useCreatorQuestions = (
  tiles: TileModel[],
  setTile: (index: number, tile: TileModel) => void,
  setTiles: (index: number[], tile: TileModel[]) => void,
  selectedTileId: number[] | null,
  selectTile: (selectedId: number[] | null) => void,
  setSelectedDirection: (direction: QuestionDirection | null,
    changeQuestion: boolean) => void,
  questionTemplates: (QuestionTemplate | undefined)[][],
  addQuestionTemplate: (index: number[], questionTemplate: QuestionTemplate) => void,
  switchQuestionTemplate: (index: number[]) => void,
  deleteQuestionTemplate: (index: number[]) => void) => {

  const [simpleTemplates] = useState<SimpleTemplate[]>(
    Array.from({ length: 64 }).map(() => ({ dependencies: [] }))
  );

  const setQuestion = (
    question: BaseQuestion,
    direction: QuestionDirection
  ) => {
    if (!tiles || !selectedTileId) return;

    addQuestionTemplate(selectedTileId, { baseQuestion: question, direction });

    const simpleModelIds = calculateAnswerTiles(selectedTileId[0], direction, question.answer.length);

    const indexes = [];
    const tileModels = [];

    const tile = tiles[selectedTileId[0]];

    indexes.push(selectedTileId[0]);
    let tileModel;
    if (tile.type === TileType.Question) {
      tileModel = new TileModel({
        type: TileType.Question,
        content: [],
        direction: [],
        questionType: [],
      });
      const id = direction === QuestionDirection.Right ? 0 : 1;
      const otherId = id === 0 ? 1 : 0;

      tileModel.content![id] = question.content;
      tileModel.content![otherId] = tile.content![otherId];
      tileModel.direction![id] = direction;
      tileModel.direction![otherId] = tile.direction![otherId];
      tileModel.questionType![id] = question.type;
      tileModel.questionType![otherId] = tile.questionType![otherId];
    } else {
      tileModel = new TileModel({
        type: TileType.Question,
        content: [question.content],
        direction: [direction],
        questionType: [question.type],
      });
    }

    tileModels.push(tileModel);

    for (const index of simpleModelIds) {
      simpleTemplates[index].dependencies = [
        ...simpleTemplates[index].dependencies,
        selectedTileId[0],
      ];

      indexes.push(index);
      tileModels.push(new TileModel({
        type: TileType.Simple,
        content: [question.answer[simpleModelIds.indexOf(index)]],
      }));
    }

    const blockPosition = calculateBlockPosition(selectedTileId[0], direction, question.answer.length);

    if (
      blockPosition &&
      tiles[blockPosition].type === TileType.Empty
    ) {
      indexes.push(blockPosition);
      tileModels.push(new TileModel({ type: TileType.CreatorBlock }));
    }

    setTiles(indexes, tileModels);
  };

  const addSecondQuestion = () => {
    if (!tiles || !selectedTileId) return;

    const tile = tiles[selectedTileId[0]];

    if (!tile || tile.type !== TileType.Question) return;

    const direction =
      tile.direction![0] === QuestionDirection.Right
        ? QuestionDirection.Bottom
        : QuestionDirection.Right;

    const id = direction === QuestionDirection.Right ? 0 : 1;
    const otherId = id === 0 ? 1 : 0;

    const tileModel = new TileModel({
      type: TileType.Question,
      content: [],
      direction: [],
      questionType: [],
    });

    tileModel.content![id] = "";
    tileModel.content![otherId] = tile.content![0];
    tileModel.direction![id] = direction;
    tileModel.direction![otherId] = tile.direction![0];
    tileModel.questionType![id] = QuestionType.Text;
    tileModel.questionType![otherId] = tile.questionType![0];

    setTile(selectedTileId[0], tileModel);
    if (direction === QuestionDirection.Right) {
      switchQuestionTemplate(selectedTileId);
    }

    const newId = [selectedTileId[0], id];
    selectTile(newId);
    const newDirection = direction === QuestionDirection.Right ? QuestionDirection.Right : QuestionDirection.Bottom;
    setSelectedDirection(newDirection, false);
  }

  const deleteQuestion = () => {
    if (!tiles || !selectedTileId) return;

    const tile = tiles[selectedTileId[0]];

    if (!tile || tile.type !== TileType.Question) return;

    const templateLength = questionTemplates[selectedTileId[0]][selectedTileId[1]]?.baseQuestion.answer.length ?? 0;

    const answerTileIds = calculateAnswerTiles(selectedTileId[0], tile.direction![selectedTileId[1]], templateLength);
    const blockPosition = calculateBlockPosition(selectedTileId[0], tile.direction![selectedTileId[1]], templateLength);

    const removableTiles: number[] = [];
    for (const index of [...answerTileIds, blockPosition].filter(n => n !== null)) {

      const tile = tiles[index];
      if (tile.type === TileType.Simple || tile.type === TileType.CreatorBlock) {

        simpleTemplates[index].dependencies = simpleTemplates[index]
          .dependencies.filter(template => {
            return !(template === selectedTileId[0]);
          });

        if (simpleTemplates[index].dependencies.length === 0) {
          removableTiles.push(index);
        }
      }
    }

    const indexes = [];
    const modelTiles = [];

    let tileModel;
    if (tile.content!.length === 1) {
      tileModel = new TileModel({ type: TileType.Empty });

      deleteQuestionTemplate(selectedTileId);
    } else {
      tileModel = new TileModel({
        type: TileType.Question,
        content: [],
        direction: [],
        questionType: [],
      });
      const id = selectedTileId[1];
      const otherId = id === 0 ? 1 : 0;

      tileModel.content = [tile.content![otherId]];
      tileModel.direction = [tile.direction![otherId]];
      tileModel.questionType = [tile.questionType![otherId]];

      deleteQuestionTemplate(selectedTileId);
      if (selectedTileId[1] === 0) {
        switchQuestionTemplate(selectedTileId);
      }
    }
    indexes.push(selectedTileId[0]);
    modelTiles.push(tileModel);

    for (const index of removableTiles) {
      indexes.push(index);
      modelTiles.push(new TileModel({ type: TileType.Empty }));
    }

    setTiles(indexes, modelTiles);
    selectTile(null);
  }

  return {
    setQuestion,
    addSecondQuestion,
    deleteQuestion
  };
}