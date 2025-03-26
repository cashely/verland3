/*
  Warnings:

  - You are about to drop the column `nickname` on the `Pet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "username" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "menu" INTEGER NOT NULL DEFAULT 1,
    "bookDateTime" DATETIME NOT NULL,
    "isExpress" INTEGER NOT NULL DEFAULT 2,
    "expressDateTime" DATETIME,
    "addressId" TEXT NOT NULL,
    "isRite" INTEGER NOT NULL DEFAULT 2,
    "riteDateTIme" DATETIME,
    "petId" TEXT NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "payAmount" INTEGER NOT NULL,
    "payChannel" INTEGER NOT NULL DEFAULT 1,
    "mark" TEXT,
    "channel" INTEGER NOT NULL DEFAULT 1,
    "statu" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "ticketId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Book_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Book_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Book_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Book" ("addressId", "bookDateTime", "channel", "createdAt", "expressDateTime", "id", "isExpress", "isRite", "mark", "menu", "payAmount", "payChannel", "petId", "riteDateTIme", "statu", "ticketId", "totalAmount", "userId") SELECT "addressId", "bookDateTime", "channel", "createdAt", "expressDateTime", "id", "isExpress", "isRite", "mark", "menu", "payAmount", "payChannel", "petId", "riteDateTIme", "statu", "ticketId", "totalAmount", "userId" FROM "Book";
DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";
CREATE UNIQUE INDEX "Book_petId_key" ON "Book"("petId");
CREATE UNIQUE INDEX "Book_userId_key" ON "Book"("userId");
CREATE UNIQUE INDEX "Book_ticketId_key" ON "Book"("ticketId");
CREATE TABLE "new_Pet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "petname" TEXT,
    "weight" INTEGER,
    "age" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "subType" TEXT NOT NULL,
    "bookId" TEXT,
    "statu" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "Pet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Pet" ("age", "bookId", "createdAt", "id", "statu", "subType", "type", "userId", "weight") SELECT "age", "bookId", "createdAt", "id", "statu", "subType", "type", "userId", "weight" FROM "Pet";
DROP TABLE "Pet";
ALTER TABLE "new_Pet" RENAME TO "Pet";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
