/*
  Warnings:

  - The `replayAt` column on the `Advise` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Advise" DROP COLUMN "replayAt",
ADD COLUMN     "replayAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "isBookDate" INTEGER NOT NULL DEFAULT 2;
