"server-only"

import { Puzzle } from "@prisma/client";
import prisma from "../db";
import { PuzzleData } from "../types/puzzle-types";

export async function getRandom(): Promise<Puzzle | null> {
  const id = 0;

  return findById(id);;
}

export async function findById(id: number): Promise<Puzzle | null> {
  return prisma.puzzle.findUnique({
    where: {
      id
    }
  });
}

export async function findByIdWithBaseQuestion(id: number): Promise<PuzzleData | null> {
  return prisma.puzzle.findUnique({
    where: {
      id
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
}