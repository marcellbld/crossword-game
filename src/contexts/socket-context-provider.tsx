"use client";

import { createContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
  InitialRoomData,
  PlayerScoreChangedData,
  SetLetterSocketCallbackData,
  SetLetterSocketData,
  SocketEvent,
} from "../shared/types";
import { usePuzzleContext, useRoomContext } from "@/lib/hooks/hooks";

type TSocketContext = {
  id: string | null;
  joinRoom: (roomId: string) => void;
  setLetter: (data: SetLetterSocketData) => void;
};

export const SocketContext = createContext<TSocketContext | null>(null);

export default function SocketContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { addPlayer, removePlayer, addScore, setPlayers } = useRoomContext();
  const { setLetter: setPuzzleLetter, setupInitials } = usePuzzleContext();

  useEffect(() => {
    const socket = io({
      autoConnect: true,
      transports: ["websocket"],
    });
    socket.connect();

    socket.on("connect", () => {
      console.log("CONNECTED");
      console.log(socket);

      setSocket(socket);
    });

    socket.on("disconnect", () => {
      console.log("DISCONNECTED");
      setSocket(null);
    });

    return () => {
      socket.off("connect");
    };
  }, []);

  const joinRoom = async (roomId: string) => {
    if (!socket) return;

    try {
      const data: InitialRoomData = await socket.emitWithAck(
        "join-room",
        roomId
      );
      setupInitials(data);
      setPlayers(data.players || []);

      socket.on(SocketEvent.JOINED_ROOM, data => {
        addPlayer(data);
      });
      socket.on(SocketEvent.LEFT_ROOM, data => {
        removePlayer(data);
      });
      socket.on(
        SocketEvent.SET_LETTER,
        ({
          socketId,
          position,
          letter,
          success,
        }: SetLetterSocketCallbackData) => {
          setPuzzleLetter({ socketId, position, letter, success });
        }
      );
      socket.on(
        SocketEvent.CHANGED_PLAYER_SCORE,
        ({ socketId, score }: PlayerScoreChangedData) => {
          addScore(socketId, score);
        }
      );
    } catch (error) {
      throw new Error("Failed to join room");
    }
  };

  const setLetter = ({ position, letter }: SetLetterSocketData) => {
    socket?.emit(SocketEvent.SET_LETTER, { position, letter });
  };

  return (
    <SocketContext.Provider
      value={{ id: socket?.id || null, joinRoom, setLetter }}
    >
      {children}
    </SocketContext.Provider>
  );
}
