"use client";

import GameBoardResponsiveWrapper from "@/components/board/board-responsive-wrapper";
import GameBoard from "./(components)/game-board";
import LetterSelectPanel from "./(components)/letter-select-panel";
import PlayerInfoPanel from "./(components)/player-info-panel";
import StatusChangePanel from "./(components)/status-change-panel";
import { usePuzzleContext, useSocketContext } from "@/lib/hooks/context-hooks";
import { useRoomId } from "@/lib/hooks/use-room-id";
import { useEffect, useState } from "react";
import Confetti from "@/components/animations/confetti";
import GameOverPanel from "./(components)/game-over-panel";
import RoomInfoPanel from "./(components)/room-info-panel";

export default function RoomIdPage() {
  const { joinRoom, id } = useSocketContext();
  const { tiles, isCompleted } = usePuzzleContext();
  const [initialized, setInitialized] = useState(false);

  const roomId = useRoomId();

  useEffect(() => {
    if (tiles) {
      setInitialized(true);
      console.log("setInitialized");
    }
  }, [tiles, setInitialized]);

  useEffect(() => {
    if (id === null) return;

    const callJoinRoom = async () => {
      await joinRoom(roomId);
    };

    setTimeout(() => {
      callJoinRoom();
    }, 100);
  }, [id]);

  return (
    <>
      {isCompleted && (
        <div className="absolute size-full">
          <div className="relative z-10 size-full bg-black/10 flex justify-center items-center">
            <GameOverPanel className="shadow-xl border border-slate-700/50" />
          </div>
          <Confetti />
        </div>
      )}
      <div className="flex justify-center items-center">
        {!initialized && <div>Loading...</div>}
        {initialized && (
          <GameBoardResponsiveWrapper>
            <div className="bg-board-background shadow shadow-slate-500 border border-slate-700/25 p-2 rounded-[3rem] flex flex-col gap-3">
              <div className="flex items-center px-4">
                <div className="flex flex-1 justify-center items-center">
                  <PlayerInfoPanel />
                </div>
                <div className="ml-auto">
                  <RoomInfoPanel />
                </div>
              </div>
              <div className="border-2 border-[#4b3a2b] bg-board rounded-lg shadow-md shadow-slate-700">
                <GameBoard />
              </div>
              <StatusChangePanel />
              <LetterSelectPanel />
            </div>
          </GameBoardResponsiveWrapper>
        )}
      </div>
    </>
  );
}
