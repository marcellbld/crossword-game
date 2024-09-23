"use client";

import { PlayerData } from "@/shared/types";
import { createContext, useState } from "react";

type TRoomContext = {
  players: PlayerData[];
  setPlayers: (players: PlayerData[]) => void;
  addPlayer: (player: PlayerData) => void;
  removePlayer: (userId: string) => void;
  addScore: (userId: string, score: number) => void;
};

export const RoomContext = createContext<TRoomContext | null>(null);

export default function RoomContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [players, setPlayers] = useState<TRoomContext["players"]>([]);

  const addPlayer = (player: PlayerData) => {
    setPlayers(prev => [...prev, player]);
  };

  const removePlayer = (userId: string) => {
    setPlayers(prev => prev.filter(player => player.userId !== userId));
  };

  const addScore = (userId: string, score: number) => {
    setPlayers(prev =>
      prev.map(player => {
        if (player.userId === userId) {
          return { ...player, score: score };
        }
        return player;
      })
    );
  };

  return (
    <RoomContext.Provider
      value={{ players, setPlayers, addPlayer, removePlayer, addScore }}
    >
      {children}
    </RoomContext.Provider>
  );
}
