-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_addressId_fkey";

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "isSelfExpress" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN     "petStoreId" TEXT,
ALTER COLUMN "addressId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_petStoreId_fkey" FOREIGN KEY ("petStoreId") REFERENCES "PetStore"("id") ON DELETE SET NULL ON UPDATE CASCADE;
