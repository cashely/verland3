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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Address" ("area", "city", "createdAt", "detail", "id", "province", "userId") SELECT "area", "city", "createdAt", "detail", "id", "province", "userId" FROM "Address";
DROP TABLE "Address";
ALTER TABLE "new_Address" RENAME TO "Address";
CREATE UNIQUE INDEX "Address_userId_key" ON "Address"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
