import { usePuzzleContext, useRoomContext } from "@/lib/hooks/hooks";
import React, { useEffect, useState } from "react";
import { BsCircleFill, BsPersonFill } from "react-icons/bs";
import FloatingText from "./floating-text";

type PointChange = {
  id: string;
  change: number;
  refreshText: string;
};

export default function PlayerInfoPanel() {
  const { players } = useRoomContext();
  const {} = usePuzzleContext();

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
          id: player.socketId,
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
    <div className="h-full flex flex-row justify-center items-center gap-2">
      {playersCopy.map(player => {
        const changedPoint: number | undefined = pointChanges.find(
          p => p.id === player.socketId
        )?.change;

        return (
          <div key={player.socketId} className="flex flex-row items-center">
            <div className="bg-white p-1 rounded-full shadow-sm shadow-black flex justify-center items-center z-10">
              <BsCircleFill color={player.color} size={"3rem"} />
              <BsPersonFill
                className="absolute z-10 text-white"
                size={"2rem"}
              />
            </div>
            <div className="bg-white p-2 rounded-r-full shadow-sm shadow-black -translate-x-6 pl-7 flex flex-row items-center gap-4">
              <div className="uppercase w-[5ch] font-semibold">
                {player.socketId.substring(0, 5)}
              </div>
              <div className="w-[2rem] h-[2rem] bg-amber-400 p-1 rounded-full shadow-sm shadow-black/40 flex justify-center items-center">
                <div className="font-bold text-white">{player.score}</div>
                <FloatingText
                  refreshText={
                    pointChanges.find(p => p.id === player.socketId)
                      ? pointChanges.find(p => p.id === player.socketId)
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
