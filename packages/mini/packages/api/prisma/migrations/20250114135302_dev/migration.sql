-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wxid" TEXT,
    "nickname" TEXT,
    "addressId" TEXT,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "avatarId" TEXT,
    CONSTRAINT "User_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "Image" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "province" TEXT,
    "city" TEXT,
    "area" TEXT,
    "detail" TEXT,
    "userId" TEXT NOT NULL,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nickname" TEXT,
    "weight" INTEGER,
    "age" TEXT,
    "userId" TEXT NOT NULL,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Pet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "petId" TEXT,
    CONSTRAINT "Image_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_wxid_key" ON "User"("wxid");

-- CreateIndex
CREATE UNIQUE INDEX "Address_userId_key" ON "Address"("userId");
