import { CreatorContext } from "@/contexts/creator-context-provider";
import { PuzzleContext } from "@/contexts/puzzle-context-provider";
import { RoomContext } from "@/contexts/room-context-provider";
import { SocketContext } from "@/contexts/socket-context-provider";
import { useContext } from "react";

export function useSocketContext() {
  const context = useContext(SocketContext);

  if (!context) throw new Error("useSocketContext must be used within a SocketContextProvider");

  return context;
}

export function usePuzzleContext() {
  const context = useContext(PuzzleContext);

  if (!context) throw new Error("usePuzzleContext must be used within a PuzzleContextProvider");

  return context;
}

export function useRoomContext() {
  const context = useContext(RoomContext);

  if (!context) throw new Error("useRoomContext must be used within a RoomContextProvider");

  return context;
}

export function useCreatorContext() {
  const context = useContext(CreatorContext);

  if (!context) throw new Error("useCreatorContext must be used within a CreatorContextProvider");

  return context;
}