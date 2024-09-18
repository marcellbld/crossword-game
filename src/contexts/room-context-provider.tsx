"use client";

import { PlayerData } from "@/shared/types";
import { createContext, useState } from "react";

type TRoomContext = {
  players: PlayerData[];
  setPlayers: (players: PlayerData[]) => void;
  addPlayer: (player: PlayerData) => void;
  removePlayer: (socketId: string) => void;
  addScore: (socketId: string, score: number) => void;
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

  const removePlayer = (socketId: string) => {
    setPlayers(prev => prev.filter(player => player.socketId !== socketId));
  };

  const addScore = (socketId: string, score: number) => {
    setPlayers(prev =>
      prev.map(player => {
        if (player.socketId === socketId) {
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
