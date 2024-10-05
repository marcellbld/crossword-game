"use client";

import { Player } from "@/shared/types/player";
import { RoomData } from "@/shared/types/room";
import { createContext, useState } from "react";

type TRoomContext = {
  players: Player[];
  setPlayers: (players: Player[]) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (userId: string) => void;
  addScore: (userId: string, score: number) => void;
  roomData: RoomData | null;
  setRoomData: (roomData: RoomData) => void;
};

export const RoomContext = createContext<TRoomContext | null>(null);

type RoomContextProviderProps = {
  children: React.ReactNode;
};

export default function RoomContextProvider({
  children,
}: RoomContextProviderProps) {
  const [players, setPlayers] = useState<TRoomContext["players"]>([]);
  const [roomData, setRoomData] = useState<TRoomContext["roomData"]>(null);

  const addPlayer = (player: Player) => {
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
      value={{
        players,
        setPlayers,
        addPlayer,
        removePlayer,
        addScore,
        roomData,
        setRoomData,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}
