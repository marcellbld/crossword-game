"use client";

import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { InitialRoom } from "@/shared/types/room";
import { ClientSocket as Socket } from "@/shared/types/socket";
import { SocketData } from "@/shared/types/socket";
import { usePuzzleContext, useRoomContext } from "@/lib/hooks/context-hooks";
import { UserProgress } from "@prisma/client";

type TSocketContext = {
  id: string | null;
  name: string | null;
  userProgress: UserProgress | null;
  joinRoom: (roomId: string) => void;
  setLetter: (position: number, letter: string) => void;
  setName: (name: string) => void;
  playProgressGame: () => Promise<string>;
  nextGame: () => void;
};

export const SocketContext = createContext<TSocketContext | null>(null);

export default function SocketContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketData, setSocketData] = useState<SocketData | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const { addPlayer, removePlayer, addScore, setPlayers, setRoomData } =
    useRoomContext();
  const {
    setLetter: setPuzzleLetter,
    setupInitials,
    setCompleted,
  } = usePuzzleContext();

  useEffect(() => {
    const socket: Socket = io({
      autoConnect: true,
      transports: ["websocket"],
    });

    const sessionId = localStorage.getItem("sessionId");
    if (sessionId) {
      socket.auth = { sessionId };
    }

    socket.on("connect", () => {
      setSocket(socket);
    });

    socket.on(
      "session",
      (data: SocketData, userProgress: UserProgress | null) => {
        socket.auth = { sessionId: data.sessionId };

        localStorage.setItem("sessionId", data.sessionId);

        setSocketData(data);
        setUserProgress(userProgress);
      }
    );

    socket.on("disconnect", () => {
      setSocket(null);
    });

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
    socket.on("completedGame", () => {
      setCompleted(true);
    });
    socket.on("nextGame", (data: InitialRoom) => {
      setCompleted(false);
      receiveInitialData(data);
    });

    return () => {
      socket.off("connect");
      socket.off("session");
      socket.off("disconnect");
      socket.off("joinedRoom");
      socket.off("leftRoom");
      socket.off("changedPlayerScore");
      socket.off("setLetter");
      socket.off("completedGame");
      socket.off("nextGame");
    };
  }, []);

  const receiveInitialData = (data: InitialRoom) => {
    setupInitials(data);
    setRoomData(data);
    setPlayers(data.players || []);
  };

  const joinRoom = (roomId: string) => {
    socket?.emit("joinRoom", roomId, (data: InitialRoom) => {
      receiveInitialData(data);
    });
  };

  const setLetter = (position: number, letter: string) => {
    socket?.emit("setLetter", position, letter);
  };

  const setName = (name: string) => {
    socket?.emit("setName", name);
  };

  const nextGame = () => {
    socket?.emit("nextGame");
  };

  const playProgressGame = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!socket) reject();

      socket!
        .timeout(10000)
        .emit(
          "playProgressGame",
          (err: unknown, data: InitialRoom, roomId: string) => {
            if (err && err instanceof Error) {
              reject(err.message);
            }

            receiveInitialData(data);
            resolve(roomId);
          }
        );
    });
  };

  return (
    <SocketContext.Provider
      value={{
        id: socket?.id ?? null,
        name: socketData?.name ?? null,
        userProgress,
        joinRoom,
        setLetter,
        setName,
        playProgressGame,
        nextGame,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
