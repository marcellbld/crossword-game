/*
  Warnings:

  - Added the required column `progressGame` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "progressGame" BOOLEAN NOT NULL;
