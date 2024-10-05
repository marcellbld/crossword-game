"server-only"

import { UserProgress } from "@prisma/client";
import prisma from "../db";

export async function create(userId: string): Promise<UserProgress | null> {
  const userProgress = await prisma.userProgress.create({
    data: {
      userId
    }
  });

  return userProgress;
}

export async function update(userId: string, level: number): Promise<UserProgress | null> {
  const userProgress = await prisma.userProgress.update({
    where: {
      userId
    },
    data: {
      level
    }
  });

  return userProgress;
}

export async function findByUserId(userId: string): Promise<UserProgress | null> {
  const userProgress = await prisma.userProgress.findUnique({
    where: {
      userId
    }
  });

  return userProgress;
}