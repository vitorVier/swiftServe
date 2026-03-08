-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "stage" TEXT NOT NULL DEFAULT 'pending';
