"use server"

import { baseQuestionUtils } from "@/lib/server-utils";
import { BaseQuestion } from "@prisma/client";

export async function getBaseQuestions(maxLength: number, characters: string[], ignoreQuestions: number[]): Promise<BaseQuestion[]> {
  try {
    return baseQuestionUtils.findAll(maxLength, characters, ignoreQuestions);
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e.message);
    }

    throw new Error("Failed to get base questions");
  }
}
