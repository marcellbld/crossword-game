"server-only"

import { Room } from "@prisma/client";
import prisma from "../db";


export async function create(puzzleId: number, progressGame: boolean, playerCapacity: number = 2): Promise<Room> {
  const room = await prisma.room.create({
    data: {
      puzzleId,
      playerCapacity,
      progressGame
    }
  });

  return room;
}

export async function update(id: string, puzzleId: number): Promise<Room> {
  const room = await prisma.room.update({
    where: {
      id
    },
    data: {
      puzzleId
    }
  });

  return room;
}

export async function remove(id: string) {
  const room = await prisma.room.delete({ where: { id } });

  return room;
}

export async function findById(id: string): Promise<Room | null> {
  const room = await prisma.room.findUnique({
    where: {
      id
    }
  });

  return room;
}