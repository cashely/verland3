/*
  Warnings:

  - The `handleDateTime` column on the `Book` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `riteDateTime` column on the `Book` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `bookDateTime` on the `Book` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "bookDateTime",
ADD COLUMN     "bookDateTime" TIMESTAMP(3) NOT NULL,
DROP COLUMN "handleDateTime",
ADD COLUMN     "handleDateTime" TIMESTAMP(3),
DROP COLUMN "riteDateTime",
ADD COLUMN     "riteDateTime" TIMESTAMP(3);
