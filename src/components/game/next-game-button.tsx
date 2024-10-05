import { PlayIcon } from "lucide-react";
import { useSocketContext } from "@/lib/hooks/context-hooks";
import { Button } from "../ui/button";

export default function NextGameButton() {
  const { nextGame } = useSocketContext();

  return (
    <Button onClick={() => nextGame()} className="h-12 mt-3">
      <div className="flex justify-center items-center gap-1">
        <PlayIcon />
        <span>Next Crossword</span>
      </div>
    </Button>
  );
}
