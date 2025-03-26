/*
  Warnings:

  - You are about to drop the column `avatarId` on the `User` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "WxAccessToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "expiresIn" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "WxAccessToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wxid" TEXT,
    "nickname" TEXT,
    "addressId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "avatar" TEXT,
    "phone" TEXT,
    CONSTRAINT "User_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("addressId", "createdAt", "id", "nickname", "phone", "wxid") SELECT "addressId", "createdAt", "id", "nickname", "phone", "wxid" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_wxid_key" ON "User"("wxid");
CREATE UNIQUE INDEX "User_addressId_key" ON "User"("addressId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
