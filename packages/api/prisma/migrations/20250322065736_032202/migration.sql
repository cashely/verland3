/*
  Warnings:

  - You are about to drop the column `expressDateTime` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `isExpress` on the `Book` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "menu" INTEGER NOT NULL DEFAULT 1,
    "bookDateTime" DATETIME NOT NULL,
    "handleWay" INTEGER NOT NULL DEFAULT 1,
    "handleDateTime" DATETIME,
    "addressId" TEXT NOT NULL,
    "isRite" INTEGER NOT NULL DEFAULT 2,
    "riteDateTime" DATETIME,
    "petId" TEXT NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "payAmount" INTEGER,
    "payChannel" INTEGER NOT NULL DEFAULT 1,
    "mark" TEXT,
    "channel" INTEGER NOT NULL DEFAULT 1,
    "statu" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "ticketId" TEXT,
    "outTradeNo" TEXT,
    "transactionId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "phone" TEXT,
    "username" TEXT,
    "evaluateId" TEXT,
    CONSTRAINT "Book_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Book_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Book_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Book" ("addressId", "bookDateTime", "channel", "createdAt", "evaluateId", "id", "isRite", "mark", "menu", "outTradeNo", "payAmount", "payChannel", "petId", "phone", "riteDateTime", "statu", "ticketId", "totalAmount", "transactionId", "userId", "username") SELECT "addressId", "bookDateTime", "channel", "createdAt", "evaluateId", "id", "isRite", "mark", "menu", "outTradeNo", "payAmount", "payChannel", "petId", "phone", "riteDateTime", "statu", "ticketId", "totalAmount", "transactionId", "userId", "username" FROM "Book";
DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";
CREATE UNIQUE INDEX "Book_petId_key" ON "Book"("petId");
CREATE UNIQUE INDEX "Book_ticketId_key" ON "Book"("ticketId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
