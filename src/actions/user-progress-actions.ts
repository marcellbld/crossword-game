"use server";

import { findUserProgress, createUserProgress as createUserProgressDb } from "../lib/server-utils";
import { UserProgress } from "@prisma/client";

export async function createUserProgress(userId: string): Promise<UserProgress | null> {
  try {
    return await createUserProgressDb(userId);
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e.message);
    }
    throw new Error("Failed to create user progress");
  }
}

export async function getUserProgress(userId: string): Promise<UserProgress | null> {
  try {
    return await findUserProgress(userId);
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e.message);
    }

    throw new Error("Failed to get user progress");
  }
}