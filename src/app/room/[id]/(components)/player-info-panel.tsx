import { useRoomContext } from "@/lib/hooks/hooks";
import React, { useEffect, useState } from "react";
import { BsCircleFill, BsPersonFill } from "react-icons/bs";
import FloatingText from "@/components/floating-text";

type PointChange = {
  id: string;
  change: number;
  refreshText: string;
};

export default function PlayerInfoPanel() {
  const { players } = useRoomContext();

  const [playersCopy, setPlayersCopy] = useState(players);
  const [pointChanges, setPointChanges] = useState([] as PointChange[]);

  useEffect(() => {
    const newPointsChanged = [];
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      const playerCopy = playersCopy[i];

      if (!playersCopy[i]) continue;

      if (player.score !== playerCopy.score) {
        newPointsChanged.push({
          id: player.userId,
          change: player.score - playerCopy.score,
          refreshText: Math.random().toString(),
        } as PointChange);
      }
    }
    setPointChanges(newPointsChanged);
    setPlayersCopy(players);

    const timer = setTimeout(() => {
      setPointChanges([]);
    }, 1500);

    return () => clearTimeout(timer);
  }, [players]);

  return (
    <div className="h-[2rem] sm:h-[4rem] md:h-[4.75rem] xl:h-[5rem] flex flex-row justify-center items-center gap-2">
      {playersCopy.map(player => {
        const changedPoint: number | undefined = pointChanges.find(
          p => p.id === player.userId
        )?.change;

        return (
          <div
            key={player.userId}
            className="h-full flex flex-row items-center"
          >
            <div
              className="size-full aspect-square bg-white p-1 rounded-full shadow-sm shadow-black flex justify-center items-center"
              style={{ zIndex: 1 }}
            >
              <BsCircleFill
                color={player.color}
                className="aspect-square size-full"
              />
              <BsPersonFill className="absolute text-white size-[1.25rem] sm:size-[2.25rem] md:size-[3rem] xl:size-[3.75rem]" />
            </div>
            <div
              className="h-[1.5rem] sm:h-[2.5rem] md:h-[3.5rem] xl:h-[4rem] bg-white p-2 rounded-r-full shadow-sm shadow-black -translate-x-6 pl-7 flex flex-row items-center gap-2
             text-xs sm:text-sm md:text-lg lg:text-xl xl:text-xl"
            >
              <div className="uppercase w-[5ch] font-semibold text-nowrap">
                {player.name}
              </div>
              <div className="size-[1.3rem] sm:size-[2.1rem] md:size-[2.7rem] xl:size-[3.2rem] aspect-square bg-amber-400 p-1 rounded-full shadow-sm shadow-black/40 flex justify-center items-center">
                <div className="font-bold text-white text-[0.7rem] sm:text-sm md:text-lg lg:text-xl xl:text-xl">
                  {player.score}
                </div>
                <FloatingText
                  refreshText={
                    pointChanges.find(p => p.id === player.userId)
                      ? pointChanges.find(p => p.id === player.userId)
                          ?.refreshText
                      : null
                  }
                >
                  {changedPoint && changedPoint > 0 && (
                    <div className="text-lime-600 text-lg font-semibold">
                      {"+" + changedPoint}
                    </div>
                  )}
                  {changedPoint && changedPoint < 0 && (
                    <div className="text-red-600 text-lg font-semibold">
                      {changedPoint}
                    </div>
                  )}
                </FloatingText>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
