-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "puzzleId" INTEGER NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Puzzle" (
    "id" INTEGER NOT NULL,

    CONSTRAINT "Puzzle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tile" (
    "id" SERIAL NOT NULL,
    "type" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "puzzleId" INTEGER NOT NULL,

    CONSTRAINT "Tile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "direction" INTEGER NOT NULL,
    "tileId" INTEGER NOT NULL,
    "baseQuestionId" INTEGER NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BaseQuestion" (
    "id" INTEGER NOT NULL,
    "type" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "BaseQuestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_puzzleId_fkey" FOREIGN KEY ("puzzleId") REFERENCES "Puzzle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tile" ADD CONSTRAINT "Tile_puzzleId_fkey" FOREIGN KEY ("puzzleId") REFERENCES "Puzzle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_tileId_fkey" FOREIGN KEY ("tileId") REFERENCES "Tile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_baseQuestionId_fkey" FOREIGN KEY ("baseQuestionId") REFERENCES "BaseQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
