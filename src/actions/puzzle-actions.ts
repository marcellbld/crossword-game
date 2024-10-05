"use server"

import { puzzleUtils } from "@/lib/server-utils";
import { PuzzleData } from "@/shared/types/puzzle";
import { Puzzle } from "@prisma/client";

export async function getPuzzle(id: number): Promise<Puzzle | null> {
  return puzzleUtils.findById(id);
}

export async function getPuzzleData(id: number): Promise<PuzzleData | null> {
  return puzzleUtils.findByIdWithBaseQuestion(id);
}