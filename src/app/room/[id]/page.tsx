"use client";

import GameBoard from "./(components)/game-board";
import GameBoardResponsiveWrapper from "./(components)/game-board-responsive-wrapper";
import LetterSelectPanel from "./(components)/letter-select-panel";
import PlayerInfoPanel from "./(components)/player-info-panel";
import StatusChangePanel from "./(components)/status-change-panel";
import { usePuzzleContext, useSocketContext } from "@/lib/hooks/hooks";
import { useRoomId } from "@/lib/hooks/use-room-id";
import { useEffect, useState } from "react";

export default function RoomIdPage() {
  const { joinRoom, id } = useSocketContext();
  const { tiles } = usePuzzleContext();
  const [initialized, setInitialized] = useState(false);

  const roomId = useRoomId();

  useEffect(() => {
    if (tiles) {
      setInitialized(true);
    }
  }, [tiles]);

  useEffect(() => {
    const callJoinRoom = async () => {
      await joinRoom(roomId);
    };
    callJoinRoom().then(() => {
      console.log("FROM CALLJOINROOM");
    });
  }, [id]);

  return (
    <div className="flex justify-center items-center">
      {!initialized && <div>Loading...</div>}
      {initialized && (
        <GameBoardResponsiveWrapper>
          <div className="bg-board-background shadow shadow-slate-500 border border-slate-700/25 p-2 rounded-[3rem] flex flex-col gap-3">
            <PlayerInfoPanel />
            <div className="border-2 border-[#4b3a2b] bg-board rounded-lg shadow-md shadow-slate-700">
              <GameBoard tiles={tiles!} />
            </div>
            <StatusChangePanel />
            <LetterSelectPanel />
          </div>
        </GameBoardResponsiveWrapper>
      )}
    </div>
  );
}
