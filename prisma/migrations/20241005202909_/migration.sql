-- AlterTable
CREATE SEQUENCE puzzle_id_seq;
ALTER TABLE "Puzzle" ALTER COLUMN "id" SET DEFAULT nextval('puzzle_id_seq');
ALTER SEQUENCE puzzle_id_seq OWNED BY "Puzzle"."id";
