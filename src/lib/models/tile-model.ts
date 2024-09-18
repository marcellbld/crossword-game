import { TileType } from "@/shared/types";
import { QuestionDirection, QuestionType } from "../types/question-types";

export class TileModel {
  type: TileType;
  questionType?: QuestionType[];
  content?: string[];
  direction?: QuestionDirection[];


  constructor({ type, questionType, content, direction }: { type: TileType, questionType?: QuestionType[], content?: string[], direction?: QuestionDirection[] }) {
    this.type = type;
    this.questionType = questionType;
    this.content = content;
    this.direction = direction;
  }
}

//public id: number, public type: TileType, public questionType?: QuestionType, public question?: string, public answer?: string, public direction?: QuestionDirection