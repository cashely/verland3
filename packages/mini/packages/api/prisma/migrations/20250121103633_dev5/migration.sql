/*
  Warnings:

  - You are about to drop the column `createAt` on the `Image` table. All the data in the column will be lost.
  - Added the required column `title` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Image" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "petId" TEXT,
    "bookGoodId" TEXT,
    "ticketId" TEXT,
    CONSTRAINT "Image_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("bookGoodId", "id", "path", "petId", "ticketId", "userId") SELECT "bookGoodId", "id", "path", "petId", "ticketId", "userId" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
CREATE UNIQUE INDEX "Image_ticketId_key" ON "Image"("ticketId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
