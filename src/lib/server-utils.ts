"server-only"

import { BaseQuestion, Prisma, Room } from "@prisma/client";
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

export async function createRoom(puzzleId: number): Promise<Room> {
  const room = await prisma.room.create({
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

export async function findAllBaseQuestions(maxLength: number, characters: string[], ignoreQuestions: number[]): Promise<BaseQuestion[]> {

  let startsWith = "";
  for (let i = 0; i < characters.length; i++) {
    if (characters[i]) {
      startsWith += characters[i];
    } else {
      startsWith += "_";
    }
  }
  startsWith += "%";

  let baseQuestions = [];

  if (ignoreQuestions.length > 0) {

    baseQuestions = await prisma.$queryRaw<BaseQuestion[]>`
    SELECT * FROM "BaseQuestion" 
      WHERE LENGTH("answer") <= ${maxLength}
        AND "id" NOT IN (${Prisma.join(ignoreQuestions)})
        AND "answer" ILIKE ${startsWith}
  `;
  } else {
    baseQuestions = await prisma.$queryRaw<BaseQuestion[]>`
    SELECT * FROM "BaseQuestion" 
      WHERE LENGTH("answer") <= ${maxLength}
        AND "answer" ILIKE ${startsWith}
  `;
  }


  return baseQuestions;
}