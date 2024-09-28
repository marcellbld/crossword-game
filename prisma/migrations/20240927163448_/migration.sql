-- CreateTable
CREATE TABLE "UserProgress" (
    "userId" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserProgress_pkey" PRIMARY KEY ("userId")
);
