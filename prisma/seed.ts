import { PrismaClient } from "@prisma/client";
import { promises as fs } from "fs";

const prisma = new PrismaClient();

function convertToQuestionType(type: string) {
  switch (type) {
    case "text":
      return 0;
    case "emoji":
      return 1;
    case "color":
      return 2;
    default:
      return 0;
  }
}

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

async function main() {
  console.log(`Start seeding ...`);

  // Base Questions
  const bqFile = await fs.readFile(
    process.cwd() + "/src/app/base-questions.json",
    "utf8"
  );
  const bqData = JSON.parse(bqFile);

  for (const tile of bqData) {
    await prisma.baseQuestion.create({
      data: {
        id: tile.id,
        type: convertToQuestionType(tile.type),
        content: tile.content,
        answer: tile.answer,
      },
    });
  }

  // Boards
  const file = await fs.readFile(
    process.cwd() + "/src/app/board-example.json",
    "utf8"
  );
  const data = JSON.parse(file);

  for (const board of data) {
    await prisma.puzzle.create({
      data: {
        id: board.id,
      },
    });

    for (const tile of board.tiles) {
      const createdTile = await prisma.tile.create({
        data: {
          type: convertToTileType(tile.type),
          position: tile.position,
          puzzleId: board.id
        },
      });

      if (tile.type === "question") {
        for (const question of tile.questions) {
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

    console.log(`Seeding finished.`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });