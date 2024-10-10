import { createPuzzle } from "@/actions/puzzle-actions";
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


async function main() {
  console.log(`Start seeding ...`);

  // Base Questions
  const bqFile = await fs.readFile(
    process.cwd() + "/prisma/base-questions.json",
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
    process.cwd() + "/prisma/board-example.json",
    "utf8"
  );
  const data = JSON.parse(file);

  for (const board of data) {
    await createPuzzle(board);
  }

  console.log(`Seeding finished.`);
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