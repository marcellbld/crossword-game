-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "puzzleId" INTEGER NOT NULL,
    CONSTRAINT "Room_puzzleId_fkey" FOREIGN KEY ("puzzleId") REFERENCES "Puzzle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
