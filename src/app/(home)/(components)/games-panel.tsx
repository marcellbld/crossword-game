import RandomGameButton from "@/components/game/random-game-button";
import SingleplayerGameButton from "@/components/game/singleplayer-game-button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useSocketContext } from "@/lib/hooks/context-hooks";
import { Separator } from "@radix-ui/react-separator";
import Image from "next/image";

export default function GamesPanel() {
  const { userProgress } = useSocketContext();

  const userLevel: number | undefined = userProgress?.level;

  return (
    <Card className="w-full rounded-3xl">
      <CardHeader>
        <CardTitle>Games</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <Separator className="bg-slate-500/30" />
        <h3 className="p-2 font-semibold text-slate-800">Singleplayer</h3>
        <div className="flex flex-col justify-center items-center gap-2">
          <div className="flex justify-center items-center gap-4 border py-2 px-4 rounded-3xl">
            <Image
              src="/images/crossword-icon.png"
              width={100}
              height={100}
              alt="Crossword Icon"
              className="size-[2rem]"
            />
            <div className="flex flex-col justify-center items-center gap-1">
              <div className="font-semibold">Progress</div>
              <div>Level {(userLevel ?? -1) + 1}</div>
            </div>
          </div>
        </div>
        <div className="text-center pt-2 pb-4">
          <SingleplayerGameButton />
        </div>
        <Separator className="bg-slate-500/30" />
        <h3 className="p-2 font-semibold text-slate-800">Multiplayer</h3>
        <div className="text-center py-2">
          <RandomGameButton />
        </div>
      </CardContent>
    </Card>
  );
}
