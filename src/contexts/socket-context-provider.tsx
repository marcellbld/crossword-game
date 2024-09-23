"use client";

import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  InitialRoomData,
  ClientSocket as Socket,
  SocketData,
} from "../shared/types";
import { usePuzzleContext, useRoomContext } from "@/lib/hooks/hooks";

type TSocketContext = {
  id: string | null;
  name: string | null;
  joinRoom: (roomId: string) => void;
  setLetter: (position: number, letter: string) => void;
  setName: (name: string) => void;
};

export const SocketContext = createContext<TSocketContext | null>(null);

export default function SocketContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketData, setSocketData] = useState<SocketData | null>(null);
  const { addPlayer, removePlayer, addScore, setPlayers } = useRoomContext();
  const { setLetter: setPuzzleLetter, setupInitials } = usePuzzleContext();

  useEffect(() => {
    const socket: Socket = io({
      autoConnect: false,
      transports: ["websocket"],
    });

    const sessionId = localStorage.getItem("sessionId");
    if (sessionId) {
      socket.auth = { sessionId };
    }

    socket.connect();

    socket.on("connect", () => {
      console.log("CONNECTED");
      console.log(socket);

      setSocket(socket);
    });

    socket.on("session", data => {
      socket.auth = { sessionId: data.sessionId };

      localStorage.setItem("sessionId", data.sessionId);

      setSocketData(data);
    });

    socket.on("disconnect", () => {
      console.log("DISCONNECTED");
      setSocket(null);
    });

    return () => {
      socket.off("connect");
      socket.off("session");
      socket.off("disconnect");
      socket.off("joinedRoom");
      socket.off("leftRoom");
      socket.off("changedPlayerScore");
      socket.off("setLetter");
    };
  }, []);

  const receiveInitialData = (socket: Socket, data: InitialRoomData) => {
    setupInitials(data);
    setPlayers(data.players || []);

    socket.on("joinedRoom", playerData => {
      addPlayer(playerData);
    });
    socket.on("leftRoom", userId => {
      removePlayer(userId);
    });
    socket.on("setLetter", (userId, position, letter, success) => {
      setPuzzleLetter(userId, position, letter, success);
    });
    socket.on("changedPlayerScore", (userId, score) => {
      addScore(userId, score);
    });
  };

  const joinRoom = (roomId: string) => {
    if (!socket) return;

    socket.emit("joinRoom", roomId, (data: InitialRoomData) => {
      receiveInitialData(socket, data);
    });
  };

  const setLetter = (position: number, letter: string) => {
    socket?.emit("setLetter", position, letter);
  };

  const setName = (name: string) => {
    socket?.emit("setName", name);
  };

  return (
    <SocketContext.Provider
      value={{
        id: socket?.id ?? null,
        name: socketData?.name ?? null,
        joinRoom,
        setLetter,
        setName,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
