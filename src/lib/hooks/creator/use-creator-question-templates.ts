import { QuestionDirection } from "@/lib/types/question-types";
import { BaseQuestion } from "@prisma/client";
import { useState } from "react";

export type QuestionTemplate = {
  baseQuestion: BaseQuestion;
  direction: QuestionDirection;
};

export const useCreatorQuestionTemplates = () => {
  const [questionTemplates, setQuestionTemplates] = useState<
    (QuestionTemplate | undefined)[][]
  >(Array.from({ length: 64 }).map(() => []));

  const addQuestionTemplate = (index: number[], questionTemplate: QuestionTemplate) => {
    setQuestionTemplates(prev =>
      [...prev].map((row, i) => {
        if (i === index[0]) {
          const newRow = [...row];
          newRow[index[1]] = questionTemplate;
          return newRow;
        }
        return row;
      }
      ))
  }

  const switchQuestionTemplate = (index: number[]) => {
    setQuestionTemplates(prev =>
      [...prev].map((row, i) => {
        if (i === index[0]) {
          const newRow = [];
          newRow[0] = row[1] ?? undefined;
          newRow[1] = row[0] ?? undefined;
          return newRow;
        }

        return row;
      }
      ));
  }

  const deleteQuestionTemplate = (index: number[]) => {
    setQuestionTemplates(prev =>
      [...prev].map((row, i) => {
        if (i === index[0]) {
          const newRow = [];
          newRow[0] = index[1] === 0 ? undefined : row[0];
          newRow[1] = index[1] === 1 ? undefined : row[1];
          return newRow;
        }

        return row;
      }
      ))
  }

  return {
    questionTemplates,
    addQuestionTemplate,
    switchQuestionTemplate,
    deleteQuestionTemplate,
  }
}