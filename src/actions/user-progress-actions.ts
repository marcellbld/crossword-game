"use server";

import { UserProgress } from "@prisma/client";
import { userProgressUtils } from "@/lib/server-utils";

export async function createUserProgress(userId: string): Promise<UserProgress | null> {
  try {
    return userProgressUtils.create(userId);
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e.message);
    }
    throw new Error("Failed to create user progress");
  }
}

export async function getUserProgress(userId: string): Promise<UserProgress | null> {
  try {
    return userProgressUtils.findByUserId(userId);
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e.message);
    }

    throw new Error("Failed to get user progress");
  }
}

export async function updateUserProgress(userId: string, level: number): Promise<UserProgress | null> {
  try {
    return userProgressUtils.update(userId, level);
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e.message);
    }

    throw new Error("Failed to update user progress");
  }
}