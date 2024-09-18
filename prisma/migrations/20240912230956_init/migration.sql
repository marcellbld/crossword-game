-- CreateTable
CREATE TABLE "Puzzle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- CreateTable
CREATE TABLE "Tile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "puzzleId" INTEGER NOT NULL,
    CONSTRAINT "Tile_puzzleId_fkey" FOREIGN KEY ("puzzleId") REFERENCES "Puzzle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" INTEGER NOT NULL,
    "direction" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "answer" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_QuestionToTile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_QuestionToTile_A_fkey" FOREIGN KEY ("A") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_QuestionToTile_B_fkey" FOREIGN KEY ("B") REFERENCES "Tile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_QuestionToTile_AB_unique" ON "_QuestionToTile"("A", "B");

-- CreateIndex
CREATE INDEX "_QuestionToTile_B_index" ON "_QuestionToTile"("B");
