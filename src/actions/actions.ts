"use server";

import { createRoom, findAllBaseQuestions } from "@/lib/server-utils";
import { BaseQuestion, Room } from "@prisma/client";

export async function createRandomGame(): Promise<Room | undefined> {
  try {
    return await createRoom(0);
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