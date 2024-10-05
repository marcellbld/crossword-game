import { QuestionType, QuestionDirection } from "@/shared/types/question";
import { TileType } from "@/shared/types/tile";

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