"use server";

import { createRoom, findAllBaseQuestions } from "@/lib/server-utils";
import { BaseQuestion, Room } from "@prisma/client";

export async function createRandomGame(): Promise<Room | undefined> {
  try {
    console.log("CREATE RANDOM GAME FUNC");

    return await createRoom(1);
  } catch (e) {
    throw new Error("Failed to create random game");
  }
}

export async function getBaseQuestions(maxLength: number, characters: string[], ignoreQuestions: number[]): Promise<BaseQuestion[]> {
  try {
    return await findAllBaseQuestions(maxLength, characters, ignoreQuestions);
  } catch (e) {
    console.log(e.message);

    throw new Error("Failed to get base questions");
  }
}