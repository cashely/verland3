-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "expressDateTime" TIMESTAMP(3),
ADD COLUMN     "expressWay" INTEGER,
ALTER COLUMN "isSelfExpress" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "expressWays" TEXT;
