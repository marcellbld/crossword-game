"server-only"

import { Puzzle } from "@prisma/client";
import prisma from "../db";
import { PuzzleData } from "../types/puzzle-types";
import CreatePuzzle from "../models/create-puzzle";


function convertToTileType(type: string) {
  switch (type) {
    case "simple":
      return 0
    case "question":
      return 1;
    case "empty":
      return 2;
    default:
      return 0;
  }
}

function convertToDirectionType(type: string) {
  switch (type) {
    case "right":
      return 1;
    case "bottom":
      return 2;
    default:
      return 1;
  }
}

export const create = async (board: CreatePuzzle): Promise<Puzzle> => {
  const createdPuzzle = await prisma.puzzle.create({});

  for (const tile of board.tiles) {
    const createdTile = await prisma.tile.create({
      data: {
        type: convertToTileType(tile.type),
        position: tile.position,
        puzzleId: createdPuzzle.id
      },
    });

    if (tile.type === "question") {
      for (const question of (tile.questions || [])) {
        await prisma.question.create({
          data: {
            direction: convertToDirectionType(question.direction),
            baseQuestionId: question.baseQuestion,
            tileId: createdTile.id
          }
        });
      }
    }
  }

  return createdPuzzle;
}

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