"use client";

import GameBoard from "@/components/game-board";
import GameBoardResponsiveWrapper from "@/components/game-board-responsive-wrapper";
import LetterSelectPanel from "@/components/letter-select-panel";
import PlayerInfoPanel from "@/components/player-info-panel";
import StatusChangePanel from "@/components/status-change-panel";
import { usePuzzleContext, useSocketContext } from "@/lib/hooks/hooks";
import { useRoomId } from "@/lib/hooks/use-room-id";
import { useEffect, useState } from "react";

export default function RoomIdPage() {
  const { joinRoom, id } = useSocketContext();
  const { tiles } = usePuzzleContext();
  // const [initialData, setInitialData] = useState<InitialRoomData | null>(null);
  const [initialized, setInitialized] = useState(false);

  const roomId = useRoomId();

  useEffect(() => {
    setInitialized(true);
  }, [tiles]);

  useEffect(() => {
    joinRoom(roomId);
  }, [id]);

  console.log("render");
  console.log(tiles);

  return (
    <div className="flex h-screen justify-center items-center">
      {!initialized && <div>Loading...</div>}
      {initialized && (
        // <PuzzleContextProvider
        //   progressBoard={initialData.progressBoard}
        //   basePuzzle={initialData.basePuzzle}
        //   letterOptions={initialData.letterOptions}
        // >
        <GameBoardResponsiveWrapper>
          <div className="bg-[#F8E0C8] p-2 rounded-[3rem] flex flex-col gap-3">
            <PlayerInfoPanel />
            <div className="border-2 border-[#4b3a2b] bg-[#888786] rounded-lg shadow-md shadow-slate-700">
              <GameBoard />
            </div>
            <StatusChangePanel />
            <LetterSelectPanel />
          </div>
        </GameBoardResponsiveWrapper>
        // </PuzzleContextProvider>
      )}
    </div>
  );
}
