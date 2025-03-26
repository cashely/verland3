/*
  Warnings:

  - You are about to drop the column `createAt` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `createAt` on the `Pet` table. All the data in the column will be lost.
  - You are about to drop the column `createAt` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ticketId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `subType` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Pet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN "bookGoodId" TEXT;
ALTER TABLE "Image" ADD COLUMN "ticketId" TEXT;
ALTER TABLE "Image" ADD COLUMN "userId" TEXT;

-- CreateTable
CREATE TABLE "adminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "BookGood" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "price" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "thumbId" TEXT,
    "content" TEXT NOT NULL,
    CONSTRAINT "BookGood_thumbId_fkey" FOREIGN KEY ("thumbId") REFERENCES "Image" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Book" (
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
    "createdAt" DATETIME NOT NULL,
    CONSTRAINT "Book_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Book_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Book_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "statu" INTEGER NOT NULL DEFAULT 2,
    "header" TEXT,
    "type" INTEGER NOT NULL DEFAULT 1,
    "number" TEXT,
    "email" TEXT NOT NULL,
    "fileId" TEXT,
    CONSTRAINT "Ticket_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ticket_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "Image" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Advise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" INTEGER NOT NULL DEFAULT 1,
    "content" TEXT NOT NULL,
    "replayAt" DATETIME NOT NULL,
    "replayContent" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Advise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_BookToBookGood" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_BookToBookGood_A_fkey" FOREIGN KEY ("A") REFERENCES "Book" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BookToBookGood_B_fkey" FOREIGN KEY ("B") REFERENCES "BookGood" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Address" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "province" TEXT,
    "city" TEXT,
    "area" TEXT,
    "detail" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Address" ("area", "city", "detail", "id", "province", "userId") SELECT "area", "city", "detail", "id", "province", "userId" FROM "Address";
DROP TABLE "Address";
ALTER TABLE "new_Address" RENAME TO "Address";
CREATE UNIQUE INDEX "Address_userId_key" ON "Address"("userId");
CREATE TABLE "new_Pet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nickname" TEXT,
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
INSERT INTO "new_Pet" ("age", "id", "nickname", "userId", "weight") SELECT "age", "id", "nickname", "userId", "weight" FROM "Pet";
DROP TABLE "Pet";
ALTER TABLE "new_Pet" RENAME TO "Pet";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wxid" TEXT,
    "nickname" TEXT,
    "addressId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "avatarId" TEXT,
    "phone" TEXT,
    CONSTRAINT "User_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "Image" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("addressId", "avatarId", "id", "nickname", "wxid") SELECT "addressId", "avatarId", "id", "nickname", "wxid" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_wxid_key" ON "User"("wxid");
CREATE UNIQUE INDEX "User_avatarId_key" ON "User"("avatarId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "BookGood_thumbId_key" ON "BookGood"("thumbId");

-- CreateIndex
CREATE UNIQUE INDEX "Book_petId_key" ON "Book"("petId");

-- CreateIndex
CREATE UNIQUE INDEX "Book_userId_key" ON "Book"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Book_ticketId_key" ON "Book"("ticketId");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_bookId_key" ON "Ticket"("bookId");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_fileId_key" ON "Ticket"("fileId");

-- CreateIndex
CREATE UNIQUE INDEX "_BookToBookGood_AB_unique" ON "_BookToBookGood"("A", "B");

-- CreateIndex
CREATE INDEX "_BookToBookGood_B_index" ON "_BookToBookGood"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Image_ticketId_key" ON "Image"("ticketId");
