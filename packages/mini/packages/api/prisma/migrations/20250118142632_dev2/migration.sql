-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Address" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "province" TEXT,
    "city" TEXT,
    "area" TEXT,
    "detail" TEXT,
    "userId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Address" ("area", "city", "createdAt", "detail", "id", "province", "userId") SELECT "area", "city", "createdAt", "detail", "id", "province", "userId" FROM "Address";
DROP TABLE "Address";
ALTER TABLE "new_Address" RENAME TO "Address";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wxid" TEXT,
    "nickname" TEXT,
    "addressId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "avatarId" TEXT,
    "phone" TEXT,
    CONSTRAINT "User_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "Image" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("addressId", "avatarId", "createdAt", "id", "nickname", "phone", "wxid") SELECT "addressId", "avatarId", "createdAt", "id", "nickname", "phone", "wxid" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_wxid_key" ON "User"("wxid");
CREATE UNIQUE INDEX "User_addressId_key" ON "User"("addressId");
CREATE UNIQUE INDEX "User_avatarId_key" ON "User"("avatarId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
