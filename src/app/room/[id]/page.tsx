"use client";

import GameBoard from "@/components/game-board";
import GameBoardResponsiveWrapper from "@/components/game-board-responsive-wrapper";
import LetterSelectPanel from "@/components/letter-select-panel";
import PlayerInfoPanel from "@/components/player-info-panel";
import StatusChangePanel from "@/components/status-change-panel";
import {
  usePuzzleContext,
  useRoomContext,
  useSocketContext,
} from "@/lib/hooks/hooks";
import { useRoomId } from "@/lib/hooks/use-room-id";
import { InitialRoomData } from "@/shared/types";
import { useEffect, useState } from "react";

export default function RoomIdPage() {
  const { joinRoom, id: socketId } = useSocketContext();
  const { setPlayers } = useRoomContext();
  const { setupInitials } = usePuzzleContext();
  const [initialData, setInitialData] = useState<InitialRoomData | null>(null);

  const roomId = useRoomId();

  console.log("rerender");

  useEffect(() => {
    const fetchRoomData = async () => {
      const data = await joinRoom(roomId);
      if (data) {
        setupInitials(data);
        setInitialData(data);
        setPlayers(data.players || []);
      }
    };

    fetchRoomData();
  }, [roomId, setPlayers, socketId]);

  return (
    <div className="flex h-screen justify-center items-center">
      {!initialData && <div>Loading...</div>}
      {initialData && (
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
