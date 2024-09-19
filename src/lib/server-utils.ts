// "server-only"

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
  console.log("CREATE ROOM FUNC 1");
  const room = await prisma.room.create({
    data: {
      puzzleId
    }
  });

  console.log("CREATE ROOM FUNC 2");
  return room;
}

export async function deleteRoom(id: string) {
  const room = await prisma.room.delete({ where: { id } });

  console.log("DELETE ROOM FUNC");
  return room;
}

export async function getRoom(roomId: string) {
  console.log("GET ROOM FUNC");
  console.log(roomId);
  const room = await prisma.room.findFirstOrThrow({
    where: {
      id: roomId
    }
  });
  console.log("GET ROOM FUNC 2");
  console.log(room);

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