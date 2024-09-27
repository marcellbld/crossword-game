import { useCreatorContext } from "@/lib/hooks/hooks";
import CreatorGameBoard from "./creator-game-board";
import { TileType } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { BaseQuestion } from "@prisma/client";
import { calculateDirection } from "@/lib/game-utils";
import { QuestionDirection } from "@/lib/types/question-types";
import CreatorControls from "./creator-controls";
import ExportJsonButton from "./export-json-button";
import CreateRoomButton from "./create-room-button";
import { shuffle } from "@/lib/utils";

export default function CreatorPanel() {
  const {
    tiles,
    selectedTileId,
    selectTile,
    selectedDirection,
    setSelectedDirection,
    addSecondQuestion,
    deleteQuestion,
    setQuestion,
    getBaseQuestions,
  } = useCreatorContext();

  const [fetchingBaseQuestions, setFetchingBaseQuestions] = useState(false);
  const [baseQuestions, setBaseQuestions] = useState<BaseQuestion[]>([]);

  let tile = null;

  if (tiles && selectedTileId) {
    tile = tiles[selectedTileId[0]];
  }

  const filterQuestions = () => {
    return (shuffle(baseQuestions) as BaseQuestion[]).slice(0, 9);
  };

  const selectQuestion = (question: BaseQuestion) => {
    setQuestion(
      question,
      selectedDirection === QuestionDirection.Right
        ? QuestionDirection.Right
        : QuestionDirection.Bottom
    );

    setBaseQuestions([]);
    selectTile(null);
  };

  const getEmptyQuestionDirection = useCallback(
    (id: number): QuestionDirection | null => {
      if (
        !tiles ||
        tiles[id].type !== TileType.Question ||
        tiles[id].content!.length >= 2
      )
        return null;

      return tiles[id].direction![0] === QuestionDirection.Right
        ? QuestionDirection.Right
        : QuestionDirection.Bottom;
    },
    [tiles]
  );

  useEffect(() => {
    const calculateLengthAndCharacters = (): [number, string[]] | null => {
      if (!tiles || !selectedDirection || !selectedTileId) return null;

      let length = 0;
      const tilePosition = selectedTileId[0];
      const dir = calculateDirection(
        selectedDirection === QuestionDirection.Right
          ? QuestionDirection.Right
          : QuestionDirection.Bottom
      );

      const max =
        selectedDirection === QuestionDirection.Bottom
          ? 64
          : (Math.floor(tilePosition / 8) + 1) * 8;
      let nextPosition = tilePosition + (length + 1) * dir;
      const characters: string[] = [];
      while (
        nextPosition < max &&
        (tiles[nextPosition].type === TileType.Simple ||
          tiles[nextPosition].type === TileType.Empty)
      ) {
        if (tiles[nextPosition].type === TileType.Simple) {
          characters[length] = tiles[nextPosition].content?.[0] ?? "";
        }
        length++;
        nextPosition = tilePosition + (length + 1) * dir;
      }

      return [length, characters];
    };
    const fetchBaseQuestions = async () => {
      if (
        !tiles ||
        !selectedDirection ||
        !selectedTileId ||
        getEmptyQuestionDirection(selectedTileId[0]) !== null
      )
        return;

      const data = calculateLengthAndCharacters();

      if (data) {
        const [length, characters] = data;

        setFetchingBaseQuestions(true);
        const baseQuestions = await getBaseQuestions(length, characters);
        setFetchingBaseQuestions(false);
        setBaseQuestions(baseQuestions);
      }
    };

    fetchBaseQuestions();
  }, [
    selectedDirection,
    selectedTileId,
    getBaseQuestions,
    tiles,
    getEmptyQuestionDirection,
  ]);

  const rightQuestionButtonControl = {
    show:
      tile?.type === TileType.Empty ||
      (tile?.type === TileType.Question &&
        !!selectedTileId &&
        getEmptyQuestionDirection(selectedTileId[0]) === null),
    disabled: selectedDirection === QuestionDirection.Right,
    onClick: () => setSelectedDirection(QuestionDirection.Right),
  };

  const bottomQuestionButtonControl = {
    show:
      tile?.type === TileType.Empty ||
      (tile?.type === TileType.Question &&
        !!selectedTileId &&
        getEmptyQuestionDirection(selectedTileId[0]) === null),
    disabled: selectedDirection === QuestionDirection.Bottom,
    onClick: () => setSelectedDirection(QuestionDirection.Bottom),
  };

  const deleteQuestionButtonControl = {
    show: tile?.type === TileType.Question,
    disabled: false,
    onClick: () => deleteQuestion(),
  };

  const addSecondQuestionButtonControl = {
    show:
      !!selectedTileId && getEmptyQuestionDirection(selectedTileId[0]) !== null,
    disabled: false,
    onClick: () => addSecondQuestion(),
  };

  return (
    <div className="bg-board-background shadow shadow-slate-500 border border-slate-700/25 px-2 pt-8 pb-6 rounded-[3rem] flex flex-col gap-3">
      <div className="flex justify-between items-center px-6">
        <CreateRoomButton />
        <div></div>
        <ExportJsonButton />
      </div>
      <div className="border-2 border-[#4b3a2b] bg-board rounded-lg shadow-md shadow-slate-700">
        <CreatorGameBoard />
      </div>
      {tile && (
        <div className="flex justify-between gap-2 items-center px-6">
          <div className="font-semibold ">Controls</div>
          <div className="flex items-center gap-2">
            <CreatorControls
              rightQuestionButton={rightQuestionButtonControl}
              bottomQuestionButton={bottomQuestionButtonControl}
              deleteQuestionButton={deleteQuestionButtonControl}
              addSecondQuestionButton={addSecondQuestionButtonControl}
            />
          </div>
        </div>
      )}
      {selectedDirection &&
        selectedTileId &&
        tiles &&
        (tiles[selectedTileId[0]].type === TileType.Empty ||
          (tiles[selectedTileId[0]].type === TileType.Question &&
            tiles[selectedTileId[0]].content![selectedTileId[1]] === "")) && (
          <div className="flex justify-center items-center w-full">
            {fetchingBaseQuestions && <Loader className="animate-spin" />}
            {!fetchingBaseQuestions &&
              (filterQuestions().length === 0 ? (
                <div>Empty</div>
              ) : (
                <div className="grid grid-cols-3 gap-3 px-5 w-full">
                  {filterQuestions().map(question => (
                    <Button
                      key={question.id}
                      size="lg"
                      className="rounded-3xl"
                      onClick={() => selectQuestion(question)}
                    >
                      {question.answer}
                    </Button>
                  ))}
                </div>
              ))}
          </div>
        )}
      {/* {tile &&
        (tile.type === TileType.Empty ||
          (tile.type === TileType.Question &&
            tiles &&
            selectedTileId &&
            !tiles[selectedTileId[0]].content![selectedTileId[1]])) && (
          <div className="flex gap-2 justify-center items-center">
            <div className="font-semibold">Create Question</div>
            {
              <Button
                disabled={selectedDirection === QuestionDirection.Right}
                className="rounded-full"
                size="smIcon"
                onClick={() => setSelectedDirection(QuestionDirection.Right)}
              >
                <ChevronRight />
              </Button>
            }
            <Button
              disabled={selectedDirection === QuestionDirection.Bottom}
              className="rounded-full"
              size="smIcon"
              onClick={() => setSelectedDirection(QuestionDirection.Bottom)}
            >
              <ChevronDown />
            </Button>

            <Button
              className="rounded-full"
              size="smIcon"
              variant="destructive"
              onClick={() => deleteQuestion()}
            >
              <Trash2 />
            </Button>
          </div>
        )}
      {selectedTileId &&
        getEmptyQuestionDirection(selectedTileId[0]) !== null && (
          <div className="flex gap-2 justify-center items-center">
            <Button onClick={() => addSecondQuestion()}>Add Question</Button>
            <Button
              className="rounded-full"
              size="smIcon"
              variant="destructive"
              onClick={() => deleteQuestion()}
            >
              <Trash2 />
            </Button>
          </div>
        )}

      {selectedTileId &&
        tiles &&
        tiles[selectedTileId[0]].type === TileType.Question &&
        getEmptyQuestionDirection(selectedTileId[0]) === null &&
        tiles[selectedTileId[0]].content![selectedTileId[1]] !== "" && (
          <div className="flex gap-2 justify-center items-center">
            <Button
              className="rounded-full"
              size="smIcon"
              variant="destructive"
              onClick={() => deleteQuestion()}
            >
              <Trash2 />
            </Button>
          </div>
        )}
      {selectedDirection &&
        selectedTileId &&
        tiles &&
        (tiles[selectedTileId[0]].type === TileType.Empty ||
          (tiles[selectedTileId[0]].type === TileType.Question &&
            tiles[selectedTileId[0]].content![selectedTileId[1]] === "")) && (
          <div className="grid grid-cols-3 gap-3 px-5">
            {fetchingBaseQuestions && <Loader className="animate-spin" />}
            {!fetchingBaseQuestions &&
              filterQuestions().map(question => (
                <Button
                  key={question.id}
                  size="lg"
                  className="rounded-3xl"
                  onClick={() => selectQuestion(question)}
                >
                  {question.answer}
                </Button>
              ))}
          </div>
        )} */}
    </div>
  );
}
