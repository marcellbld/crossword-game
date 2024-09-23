"use client";

import RandomGameButton from "@/components/random-game-button";
import SingleplayerGameButton from "@/components/singleplayer-game-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSocketContext } from "@/lib/hooks/hooks";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [connecting, setConnecting] = useState(true);

  const { id: socketId } = useSocketContext();

  useEffect(() => {
    setConnecting(!socketId);
  }, [socketId]);

  return (
    <div className="h-full flex justify-center items-center">
      {connecting && <Loader className="animate-spin" />}
      {!connecting && (
        <div className="flex flex-col items-center">
          <Card className="w-[500px] rounded-3xl">
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
                    <div>Level 0</div>
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
        </div>
      )}
    </div>
  );
}
