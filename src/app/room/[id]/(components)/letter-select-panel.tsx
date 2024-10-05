import { usePuzzleContext, useSocketContext } from "@/lib/hooks/context-hooks";
import { TileLetterOption } from "@/shared/types/tile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { XIcon } from "lucide-react";

export default function LetterSelectPanel() {
  const { selectedTileId, letterOptions, progressBoard } = usePuzzleContext();
  const { setLetter } = useSocketContext();

  const createLetterTiles = () => {
    if (!letterOptions || !selectedTileId || !progressBoard) return null;

    const letters = letterOptions[selectedTileId[0]];
    const tileLetter = progressBoard?.[selectedTileId[0]];

    const handleClickOnTile = (letter: string) => {
      setLetter(selectedTileId[0]!, letter);
    };

    const createLetterTile = (
      index: number,
      { letter, selected }: TileLetterOption
    ) => {
      const solved = !!tileLetter?.solvedBy && tileLetter?.letter === letter;
      const disabled = selected || !!tileLetter?.solvedBy;

      return (
        <motion.div
          className="h-full aspect-square"
          key={index}
          initial={{ opacity: 0, scale: 1.5 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: { delay: 0.1 * index, duration: 0.3 },
          }}
        >
          <motion.button
            disabled={disabled}
            onClick={() => handleClickOnTile(letter)}
            transition={{ duration: 0.1 }}
            whileHover={
              disabled
                ? {}
                : {
                    scale: 1.1,
                    transition: { duration: 0.2, ease: "easeOut", delay: 0 },
                  }
            }
            whileTap={disabled ? {} : { scale: 0.9 }}
            className="size-full rounded-md shadow-md shadow-slate-700"
          >
            <div
              className={cn(
                "h-full flex justify-center items-center bg-white rounded-md shadow-box-simple text-question uppercase font-bold select-none cursor-none pointer-events-none text-xl sm:text-2xl md:text-3xl",
                selected && "bg-slate-50",
                disabled && "opacity-50",
                solved && "bg-green-500 text-black/80"
              )}
            >
              {selected && !solved && (
                <XIcon className="text-red-500/65 absolute w-full h-full" />
              )}
              {letter}
            </div>
          </motion.button>
        </motion.div>
      );
    };

    return (
      <div className="h-full flex justify-center items-center gap-3">
        {letters.map((letterOption: TileLetterOption, index: number) =>
          createLetterTile(index, letterOption)
        )}
      </div>
    );
  };

  const selectedLetterTile =
    selectedTileId && !!letterOptions?.[selectedTileId[0]];

  return (
    <div className="w-full h-[2rem] sm:h-[4rem] md:h-[4.75rem] xl:h-[5rem] flex justify-center items-center my-2">
      {!selectedLetterTile && <div>Select Tile</div>}
      {selectedLetterTile && createLetterTiles()}
    </div>

    // <div className="w-full sm:w-full md:w-1/2 min-h-24 h-24 max-h-32 bg-board p-3">
    //   <div className="w-full h-full flex justify-center items-center">
    //     {!selectedLetterTile && <div>Select Tile</div>}
    //     {selectedLetterTile && createLetterTiles()}
    //   </div>
    // </div>
  );
}
