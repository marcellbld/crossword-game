"use client";

import GameBoardResponsiveWrapper from "../../components/board-responsive-wrapper";
import CreatorContextProvider from "@/contexts/creator-context-provider";
import CreatorPanel from "./(components)/creator-panel";

export default function CreatorPage() {
  return (
    <div className="flex justify-center items-center">
      <GameBoardResponsiveWrapper>
        <CreatorContextProvider>
          <CreatorPanel />
        </CreatorContextProvider>
      </GameBoardResponsiveWrapper>
    </div>
  );
}
