/*
  Warnings:

  - You are about to drop the `_QuestionToTile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `answer` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Question` table. All the data in the column will be lost.
  - Added the required column `baseQuestionId` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tileId` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_QuestionToTile_B_index";

-- DropIndex
DROP INDEX "_QuestionToTile_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_QuestionToTile";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "BaseQuestion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "answer" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "direction" INTEGER NOT NULL,
    "tileId" INTEGER NOT NULL,
    "baseQuestionId" INTEGER NOT NULL,
    CONSTRAINT "Question_tileId_fkey" FOREIGN KEY ("tileId") REFERENCES "Tile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Question_baseQuestionId_fkey" FOREIGN KEY ("baseQuestionId") REFERENCES "BaseQuestion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Question" ("direction", "id") SELECT "direction", "id" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
