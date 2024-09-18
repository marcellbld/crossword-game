"server-only"

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

export async function createRoom(puzzleId: number) {
  const room = await prisma.room.create({
    data: {
      puzzleId
    }
  });

  return room;
}

export async function getRoom(roomId: string) {
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