/*
  Warnings:

  - You are about to drop the `_BookToBookGood` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "_BookToBookGood_B_index";

-- DropIndex
DROP INDEX "_BookToBookGood_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_BookToBookGood";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "BookRelationBookGood" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookId" TEXT NOT NULL,
    "bookGoodId" TEXT NOT NULL,
    CONSTRAINT "BookRelationBookGood_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BookRelationBookGood_bookGoodId_fkey" FOREIGN KEY ("bookGoodId") REFERENCES "BookGood" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PetImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "petId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    CONSTRAINT "PetImage_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PetImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Advise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" INTEGER NOT NULL DEFAULT 1,
    "content" TEXT NOT NULL,
    "replayAt" DATETIME,
    "replayContent" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Advise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Advise" ("content", "id", "replayAt", "replayContent", "type", "userId") SELECT "content", "id", "replayAt", "replayContent", "type", "userId" FROM "Advise";
DROP TABLE "Advise";
ALTER TABLE "new_Advise" RENAME TO "Advise";
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
    "payAmount" INTEGER,
    "payChannel" INTEGER NOT NULL DEFAULT 1,
    "mark" TEXT,
    "channel" INTEGER NOT NULL DEFAULT 1,
    "statu" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "ticketId" TEXT,
    "transactionId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "phone" TEXT,
    "username" TEXT,
    "evaluateId" TEXT,
    CONSTRAINT "Book_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Book_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Book_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Book" ("addressId", "bookDateTime", "channel", "createdAt", "evaluateId", "expressDateTime", "id", "isExpress", "isRite", "mark", "menu", "payAmount", "payChannel", "petId", "riteDateTime", "statu", "ticketId", "totalAmount", "userId") SELECT "addressId", "bookDateTime", "channel", "createdAt", "evaluateId", "expressDateTime", "id", "isExpress", "isRite", "mark", "menu", "payAmount", "payChannel", "petId", "riteDateTime", "statu", "ticketId", "totalAmount", "userId" FROM "Book";
DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";
CREATE UNIQUE INDEX "Book_petId_key" ON "Book"("petId");
CREATE UNIQUE INDEX "Book_ticketId_key" ON "Book"("ticketId");
CREATE TABLE "new_Ticket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
INSERT INTO "new_Ticket" ("bookId", "createdAt", "email", "fileId", "header", "id", "number", "statu", "type", "userId") SELECT "bookId", "createdAt", "email", "fileId", "header", "id", "number", "statu", "type", "userId" FROM "Ticket";
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
CREATE UNIQUE INDEX "Ticket_bookId_key" ON "Ticket"("bookId");
CREATE UNIQUE INDEX "Ticket_fileId_key" ON "Ticket"("fileId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
