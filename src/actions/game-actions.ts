"use server";

import { roomUtils } from "@/lib/server-utils";
import { Room } from "@prisma/client";

export async function createRandomGame(): Promise<Room | undefined> {
  try {
    return roomUtils.create(Math.floor(Math.random() * 2), false);
  } catch (e) {
    throw new Error("Failed to create random game");
  }
}

export async function createGame(puzzleId: number, progressGame: boolean, playerCapacity: number): Promise<Room | undefined> {
  try {
    return roomUtils.create(puzzleId, progressGame, playerCapacity);
  } catch (e) {
    throw new Error("Failed to create random game");
  }
}

export async function nextRandomGame(roomId: string): Promise<Room | undefined> {
  try {
    return roomUtils.update(roomId, Math.floor(Math.random() * 2));
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e.message);
    }

    throw new Error("Failed to update room");
  }
}

export async function nextProgressGame(roomId: string, puzzleId: number): Promise<Room | undefined> {
  try {
    return roomUtils.update(roomId, puzzleId);
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e.message);
    }

    throw new Error("Failed to update room");
  }
}