/*
  Warnings:

  - Added the required column `userId` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ticket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "statu" INTEGER NOT NULL DEFAULT 2,
    "header" TEXT,
    "type" INTEGER NOT NULL DEFAULT 1,
    "number" TEXT,
    "email" TEXT NOT NULL,
    "fileId" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Ticket_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ticket_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "Image" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Ticket" ("bookId", "createdAt", "email", "fileId", "header", "id", "number", "statu", "type") SELECT "bookId", "createdAt", "email", "fileId", "header", "id", "number", "statu", "type" FROM "Ticket";
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
CREATE UNIQUE INDEX "Ticket_bookId_key" ON "Ticket"("bookId");
CREATE UNIQUE INDEX "Ticket_fileId_key" ON "Ticket"("fileId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
