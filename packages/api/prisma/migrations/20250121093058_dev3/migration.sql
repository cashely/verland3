-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BookGood" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "price" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "thumbId" TEXT,
    "content" TEXT NOT NULL,
    CONSTRAINT "BookGood_thumbId_fkey" FOREIGN KEY ("thumbId") REFERENCES "Image" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_BookGood" ("content", "id", "price", "thumbId", "title") SELECT "content", "id", "price", "thumbId", "title" FROM "BookGood";
DROP TABLE "BookGood";
ALTER TABLE "new_BookGood" RENAME TO "BookGood";
CREATE UNIQUE INDEX "BookGood_thumbId_key" ON "BookGood"("thumbId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
