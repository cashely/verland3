/*
  Warnings:

  - You are about to drop the column `riteDateTIme` on the `Book` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Evaluate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 5,
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    CONSTRAINT "Evaluate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Evaluate_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

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
    "riteDateTime" DATETIME,
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
    "evaluateId" TEXT,
    CONSTRAINT "Book_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Book_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Book_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Book" ("addressId", "bookDateTime", "channel", "createdAt", "expressDateTime", "id", "isExpress", "isRite", "mark", "menu", "payAmount", "payChannel", "petId", "statu", "ticketId", "totalAmount", "userId") SELECT "addressId", "bookDateTime", "channel", "createdAt", "expressDateTime", "id", "isExpress", "isRite", "mark", "menu", "payAmount", "payChannel", "petId", "statu", "ticketId", "totalAmount", "userId" FROM "Book";
DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";
CREATE UNIQUE INDEX "Book_petId_key" ON "Book"("petId");
CREATE UNIQUE INDEX "Book_userId_key" ON "Book"("userId");
CREATE UNIQUE INDEX "Book_ticketId_key" ON "Book"("ticketId");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wxid" TEXT,
    "nickname" TEXT,
    "username" TEXT,
    "addressId" TEXT,
    "gender" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "avatar" TEXT,
    "phone" TEXT,
    CONSTRAINT "User_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("addressId", "avatar", "createdAt", "id", "nickname", "phone", "username", "wxid") SELECT "addressId", "avatar", "createdAt", "id", "nickname", "phone", "username", "wxid" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_wxid_key" ON "User"("wxid");
CREATE UNIQUE INDEX "User_addressId_key" ON "User"("addressId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Evaluate_bookId_key" ON "Evaluate"("bookId");
