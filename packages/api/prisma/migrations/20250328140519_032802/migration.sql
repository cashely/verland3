/*
  Warnings:

  - You are about to drop the column `menu` on the `Book` table. All the data in the column will be lost.
  - Added the required column `menuId` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Menu" ADD COLUMN "bookId" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "menuId" TEXT NOT NULL,
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
    "outRefundNo" TEXT,
    "transactionId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "phone" TEXT,
    "username" TEXT,
    "evaluateId" TEXT,
    "expressNo" TEXT,
    "expressName" TEXT,
    "updatedAt" DATETIME,
    CONSTRAINT "Book_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Book_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Book_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Book_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Book" ("addressId", "bookDateTime", "channel", "createdAt", "evaluateId", "expressName", "expressNo", "handleDateTime", "handleWay", "id", "isRite", "mark", "outRefundNo", "outTradeNo", "payAmount", "payChannel", "petId", "phone", "riteDateTime", "statu", "ticketId", "totalAmount", "transactionId", "updatedAt", "userId", "username") SELECT "addressId", "bookDateTime", "channel", "createdAt", "evaluateId", "expressName", "expressNo", "handleDateTime", "handleWay", "id", "isRite", "mark", "outRefundNo", "outTradeNo", "payAmount", "payChannel", "petId", "phone", "riteDateTime", "statu", "ticketId", "totalAmount", "transactionId", "updatedAt", "userId", "username" FROM "Book";
DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";
CREATE UNIQUE INDEX "Book_petId_key" ON "Book"("petId");
CREATE UNIQUE INDEX "Book_ticketId_key" ON "Book"("ticketId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
