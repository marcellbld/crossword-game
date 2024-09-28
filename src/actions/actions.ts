"use server";

import { createRoom, findAllBaseQuestions, updateRoom } from "../lib/server-utils";
import { BaseQuestion, Room } from "@prisma/client";

export async function createRandomGame(): Promise<Room | undefined> {
  try {
    return await createRoom(Math.floor(Math.random() * 2), false);
  } catch (e) {
    throw new Error("Failed to create random game");
  }
}

export async function createGame(puzzleId: number, progressGame: boolean, playerCapacity: number): Promise<Room | undefined> {
  try {
    return await createRoom(puzzleId, progressGame, playerCapacity);
  } catch (e) {
    throw new Error("Failed to create random game");
  }
}

export async function getBaseQuestions(maxLength: number, characters: string[], ignoreQuestions: number[]): Promise<BaseQuestion[]> {
  try {
    return await findAllBaseQuestions(maxLength, characters, ignoreQuestions);
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e.message);
    }

    throw new Error("Failed to get base questions");
  }
}

export async function nextRandomGame(roomId: string): Promise<Room | undefined> {
  try {
    return await updateRoom(roomId, Math.floor(Math.random() * 2));
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e.message);
    }

    throw new Error("Failed to update room");
  }
}


export async function nextProgressGame(roomId: string, puzzleId: number): Promise<Room | undefined> {
  try {
    return await updateRoom(roomId, puzzleId);
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e.message);
    }

    throw new Error("Failed to update room");
  }
}