import { TileModel } from "@/lib/models/tile-model";
import { cn } from "@/lib/utils";
import React from "react";
import TileContent from "./tile-content";
import { QuestionDirection, QuestionType } from "@/lib/types/question-types";
import { PLAYER_COLORS, PlayerData, TileType } from "@/shared/types";
import { BsCircleFill, BsTriangleFill } from "react-icons/bs";
import { motion } from "framer-motion";
import TileEmoji from "./tile-emoji";

export default function Tile({
  index,
  tileModel,
  className,
  solvedBy,
  isSelected,
  handleClick,
}: {
  index: number;
  tileModel: TileModel;
  className?: string;
  solvedBy?: PlayerData | null;
  isSelected: (index: number, itemId: number, tileType: TileType) => boolean;
  handleClick: (index: number, itemId: number) => void;
}) {
  const tileType = tileModel.type;
  const BORDER_COLORS = [`border-[#3498db]`, `border-[#e74c3c]`];

  const itemNumber =
    tileModel.type === TileType.Question ? tileModel.content!.length : 1;

  return (
    <div className={cn("size-full flex flex-col")}>
      {Array.from({
        length: itemNumber,
      }).map((_, itemId) => (
        <div
          key={itemId}
          onClick={() => handleClick(index, itemId)}
          className={cn(
            "w-full flex justify-center items-center relative",
            itemNumber > 1 ? "h-[50%]" : "h-full"
          )}
        >
          <div
            className={cn(
              "size-full flex justify-center items-center rounded transition-colors bg-white",
              getBackgroundClass(tileModel),
              getHoverClass(tileModel),
              isSelected(index, itemId, tileType) &&
                getSelectedClass(tileModel),
              solvedBy && "border-[4px] border-opacity-75 rounded-md",
              solvedBy && BORDER_COLORS[PLAYER_COLORS.indexOf(solvedBy.color)],
              className
            )}
          >
            {tileType === TileType.Question && (
              <TileContent>{createQuestion(tileModel, itemId)}</TileContent>
            )}
            {tileType === TileType.Simple && (
              <TileContent>{createSimple(tileModel)}</TileContent>
            )}
            {tileType === TileType.Empty && (
              <TileContent>{createEmpty()}</TileContent>
            )}
          </div>
          {createDirectionArrow(tileModel.direction?.[itemId])}
        </div>
      ))}
    </div>
  );
}

function getSelectedClass(tileModel: TileModel) {
  switch (tileModel.type) {
    case TileType.Simple:
      return "border-2 border-cyan-400 bg-tile-simple-selected";
    case TileType.Question:
      return "border-2 border-blue-400 bg-tile-question-selected";
    case TileType.Empty:
      return "border-2 border-blue-400 bg-tile-question-selected";
    default:
      return "";
  }
}

function getHoverClass(tileModel: TileModel) {
  switch (tileModel.type) {
    case TileType.Simple:
      return "border-2 border-white hover:border-2 hover:border-cyan-300";
    case TileType.Question:
      return "border-2 border-cyan-50 hover:border-2 hover:border-cyan-300";
    case TileType.Empty:
      return "";
    default:
      return "";
  }
}

function getBackgroundClass(tileModel: TileModel) {
  switch (tileModel.type) {
    case TileType.Simple:
      return "bg-tile shadow-box-simple";
    case TileType.Question:
      return "bg-tile-question shadow-box-question";
    case TileType.Empty:
      return "bg-tile-empty shadow-box-question";
    default:
      return "";
  }
}

function createQuestion(tileModel: TileModel, questionNumber: number = 0) {
  const questionType = tileModel.questionType?.[questionNumber];

  const content = tileModel.content?.[questionNumber];
  if (!content || questionType === undefined) return;

  return (
    <div
      className="text-question uppercase font-bold leading-tight select-none cursor-none pointer-events-none
       text-[0.475rem] sm:text-xs md:text-sm"
    >
      {questionType === QuestionType.Text && content}
      {questionType === QuestionType.Color && (
        <BsCircleFill
          className="size-[0.5rem] sm:size-[1.5rem]"
          color={content}
        ></BsCircleFill>
      )}
      {questionType === QuestionType.Emoji && <TileEmoji emojiName={content} />}
    </div>
  );
}

function createSimple(tileModel: TileModel) {
  return (
    <div
      className="text-question uppercase font-bold select-none cursor-none pointer-events-none
    text-xl sm:text-2xl md:text-3xl"
    >
      {tileModel.content && (
        <motion.div
          initial={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.25, ease: "circInOut" }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {tileModel.content?.[0]}
        </motion.div>
      )}
    </div>
  );
}

function createEmpty() {
  return (
    <div className="text-question uppercase font-bold leading-tight text-[2vw] select-none cursor-none pointer-events-none"></div>
  );
}

function createDirectionArrow(direction: QuestionDirection | undefined) {
  if (!direction) return;

  let directionClass = "";

  switch (direction) {
    case QuestionDirection.Right:
      directionClass = "rotate-90";
      break;
    case QuestionDirection.Bottom:
      directionClass = "rotate-180";
      break;
    case QuestionDirection.Left:
      directionClass = "rotate-270";
      break;
  }

  return (
    <div
      className={cn(
        "absolute h-[calc(100%+2rem)] z-10 select-none cursor-none pointer-events-none ",
        directionClass
      )}
    >
      <BsTriangleFill className="size-4 text-board origin-bottom" />
    </div>
  );
}
