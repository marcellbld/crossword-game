"server-only"

import { BaseQuestion, Prisma, Room, UserProgress } from "@prisma/client";
import prisma from "./db";
import { Puzzle } from "./types/puzzle-types";

export async function getRandomPuzzle() {
  const id = 0;

  const puzzle = await prisma.puzzle.findUnique({
    where: {
      id
    }
  });

  return puzzle;
}

export async function createRoom(puzzleId: number, progressGame: boolean, playerCapacity: number = 2): Promise<Room> {
  const room = await prisma.room.create({
    data: {
      puzzleId,
      playerCapacity,
      progressGame
    }
  });

  return room;
}

export async function updateRoom(roomId: string, puzzleId: number): Promise<Room> {
  const room = await prisma.room.update({
    where: {
      id: roomId
    },
    data: {
      puzzleId
    }
  });

  return room;
}

export async function deleteRoom(id: string) {
  const room = await prisma.room.delete({ where: { id } });

  return room;
}

export async function getRoom(roomId: string): Promise<Room | null> {
  const room = await prisma.room.findUnique({
    where: {
      id: roomId
    }
  });

  return room;
}

export async function getPuzzle(puzzleId: number): Promise<Puzzle | null> {
  const puzzle = await prisma.puzzle.findUnique({
    where: {
      id: puzzleId
    }, include: {
      Tiles: {
        include: {
          Questions: {
            include: {
              BaseQuestion: true
            }
          }
        }
      }
    }
  });

  return puzzle;
}

export function firstOccurenceOfLetter(str: string, startPosition: number): number {
  for (let i = startPosition + 1; i < str.length; i++) {

    if (str[i] !== '_' && str[i] !== "%") {
      return i;
    }
  }

  return startPosition;
}

export async function findAllBaseQuestions(maxLength: number, characters: string[], ignoreQuestions: number[]): Promise<BaseQuestion[]> {
  let startsWithFull = "";
  for (let i = 0; i < characters.length; i++) {
    if (characters[i]) {
      startsWithFull += characters[i];
    } else {
      startsWithFull += "_";
    }
  }
  startsWithFull += "%";

  let startsWith = "";
  let startsWithMaxLength = 0;
  const indexOfFirstUnderscore = startsWithFull.indexOf("_");

  if (indexOfFirstUnderscore >= 1) {
    const firstLetter = firstOccurenceOfLetter(startsWithFull, indexOfFirstUnderscore);

    const diff = firstLetter - indexOfFirstUnderscore;

    if (diff > 1 || (diff === 1 && indexOfFirstUnderscore > 0)) {
      startsWith = startsWithFull.substring(0, indexOfFirstUnderscore) + "%";
      startsWithMaxLength = firstLetter - 1;

    }
  } else {
    const firstLetter = firstOccurenceOfLetter(startsWithFull, indexOfFirstUnderscore);
    const diff = firstLetter - indexOfFirstUnderscore;

    if (diff > 0) {

      const secondLetter = firstOccurenceOfLetter(startsWithFull, firstLetter);

      if (secondLetter > -1 && secondLetter > firstLetter) {

        startsWith = startsWithFull.substring(0, firstLetter + 1) + "%";
        startsWithMaxLength = secondLetter - 1;
      } else {
        startsWith = "%";
        startsWithMaxLength = firstLetter - 1;
      }
    }
  }
  const baseQuestions = [];

  if (startsWith !== "" && startsWith !== startsWithFull && ignoreQuestions.length > 0) {
    baseQuestions.push(...await prisma.$queryRaw<BaseQuestion[]>`
    SELECT * FROM "BaseQuestion" 
      WHERE LENGTH("answer") <= ${startsWithMaxLength}
        AND "id" NOT IN (${Prisma.join(ignoreQuestions)})
        AND "answer" ILIKE ${startsWith}
  `);
  } else if (startsWith !== "" && startsWith !== startsWithFull) {
    baseQuestions.push(...await prisma.$queryRaw<BaseQuestion[]>`
      SELECT * FROM "BaseQuestion" 
        WHERE LENGTH("answer") <= ${startsWithMaxLength}
          AND "answer" ILIKE ${startsWith}`);
  }

  if (ignoreQuestions.length > 0) {
    baseQuestions.push(...await prisma.$queryRaw<BaseQuestion[]>`
    SELECT * FROM "BaseQuestion" 
      WHERE LENGTH("answer") <= ${maxLength}
        AND "id" NOT IN (${Prisma.join(ignoreQuestions)})
        AND "answer" ILIKE ${startsWithFull}
  `);
  } else {
    baseQuestions.push(...await prisma.$queryRaw<BaseQuestion[]>`
    SELECT * FROM "BaseQuestion" 
      WHERE LENGTH("answer") <= ${maxLength}
        AND "answer" ILIKE ${startsWithFull}
  `);
  }

  return baseQuestions;
}

export async function createUserProgress(userId: string): Promise<UserProgress | null> {
  const userProgress = await prisma.userProgress.create({
    data: {
      userId
    }
  });

  return userProgress;
}

export async function updateUserProgress(userId: string, level: number): Promise<UserProgress | null> {
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

export async function findUserProgress(userId: string): Promise<UserProgress | null> {
  const userProgress = await prisma.userProgress.findUnique({
    where: {
      userId
    }
  });

  return userProgress;
}